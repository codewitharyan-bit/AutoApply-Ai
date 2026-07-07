const supabase = require("../config/supabase");
const { getUserByClerkId } = require("./user.service");

const getResume = async (clerkId) => {
    const user = await getUserByClerkId(clerkId);

    const { data, error } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (error) {
        throw new Error(error.message);
    }

    return data;
};


const uploadResume = async (clerkId, file) => {
  if (!file) {
    throw new Error("Resume file is required.");
  }

  const user = await getUserByClerkId(clerkId);

  // Check if user already has a resume
  const { data: existingResume, error: existingError } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  // Delete old resume if it exists
  if (existingResume) {
    const { error: storageDeleteError } = await supabase.storage
      .from("resumes")
      .remove([existingResume.file_path]);

    if (storageDeleteError) {
      throw storageDeleteError;
    }

    const { error: deleteError } = await supabase
      .from("resumes")
      .delete()
      .eq("user_id", user.id);

    if (deleteError) {
      throw deleteError;
    }
  }

  // Create safe filename
  const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");

  const filePath = `${user.id}/${Date.now()}-${safeName}`;

  // Upload to Supabase Storage
  const { error: uploadError } = await supabase.storage
    .from("resumes")
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  // Save metadata
  const { data, error } = await supabase
    .from("resumes")
    .insert({
      user_id: user.id,
      file_name: file.originalname,
      file_path: filePath,
      file_size: file.size,
    })
    .select()
    .single();

  if (error) {
    // Roll back uploaded file if DB insert fails
    await supabase.storage
      .from("resumes")
      .remove([filePath]);

    throw error;
  }

  return data;
};

const deleteResume = async (clerkId) => {
    const user = await getUserByClerkId(clerkId);

    const { data: resume } = await supabase
        .from("resumes")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

    if (!resume) {
        throw new Error("Resume not found.");
    }

    await supabase.storage
        .from("resumes")
        .remove([resume.file_path]);

    await supabase
        .from("resumes")
        .delete()
        .eq("user_id", user.id);

    // Clear resume from profile
    await supabase
        .from("profiles")
        .update({
            resume_url: null,
            updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

    return true;
};

const getResumeViewUrl = async (clerkId) => {
  const user = await getUserByClerkId(clerkId);

  const { data: resume, error } = await supabase
    .from("resumes")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!resume) {
    throw new Error("Resume not found.");
  }

  const { data, error: signedUrlError } = await supabase.storage
    .from("resumes")
    .createSignedUrl(resume.file_path, 60); // URL valid for 60 seconds

  if (signedUrlError) {
    throw signedUrlError;
  }

  return data.signedUrl;
};

module.exports = {
    getResume,
    uploadResume,
    deleteResume,
    getResumeViewUrl,
};
