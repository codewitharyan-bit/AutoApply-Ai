const supabase = require('../config/supabase');

const createUser = async ({
  clerk_id,
  email,
  name,
}) => {
  // Create or update user
  const { data, error } = await supabase
    .from('users')
    .upsert(
      { clerk_id, email, name },
      { onConflict: 'clerk_id' }
    )
    .select()

  if (error) {
    throw new Error(`Error creating user: ${error.message}`)
  }

  const user = data[0]

  // Create profile if it doesn't exist
  const { error: profileError } = await supabase
    .from('profiles')
    .upsert(
      {
        user_id: user.id,
        skills: [],
        experience: [],
        experience_level: 'Fresher',
        preferred_roles: [],
        location: '',
      },
      {
        onConflict: 'user_id',
      }
    )

  if (profileError) {
    throw new Error(
      `Error creating profile: ${profileError.message}`
    )
  }

  return user
}
const updateUser = async ({ clerk_id, email, name }) => {
    const { data, error } = await supabase
        .from('users')
        .update({ email, name })
        .eq('clerk_id', clerk_id)
        .select()

    if (error) {
        throw new Error(`Error updating user: ${error.message}`)
    }
    return data
}

const deleteUser = async ({ clerk_id }) => {
    const { error } = await supabase
        .from('users')
        .delete()
        .eq('clerk_id', clerk_id)

    if (error) {
        throw new Error(`Error deleting user: ${error.message}`)
    }
}

const getUserByClerkId = async (clerkId) => {
  console.log("Looking up Clerk ID:", clerkId);
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("clerk_id", clerkId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch user: ${error.message}`);
  }

  return data;
};

module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUserByClerkId,
}