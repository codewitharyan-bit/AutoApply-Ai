
const { Webhook } = require("svix")
const { createUser, updateUser, deleteUser } = require('../services/user.service')

const clerkWebhook = async (req, res) => {
  try {
    const svixId = req.headers["svix-id"];
    const svixTimestamp = req.headers["svix-timestamp"];
    const svixSignature = req.headers["svix-signature"];
    if (!svixId || !svixTimestamp || !svixSignature) {
      return res.status(400).json({ success: false, message: "Missing svix headers" })
    }

    const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET)
    const payload = wh.verify(req.body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    })

    const { type, data } = payload

    switch (type) {
      case 'user.created': {
        const { id: clerk_id, email_addresses, first_name, last_name } = data
        const email = email_addresses?.[0]?.email_address
        const name = [first_name, last_name].filter(Boolean).join(' ')
        await createUser({ clerk_id, email, name })
        break
      }
      case 'user.updated': {
        const { id: clerk_id, email_addresses, first_name, last_name } = data
        const email = email_addresses?.[0]?.email_address
        const name = [first_name, last_name].filter(Boolean).join(' ')
        await updateUser({ clerk_id, email, name })
        break
      }
      case 'user.deleted': {
        const { id: clerk_id } = data
        await deleteUser({ clerk_id })
        break
      }
    }

    return res.status(200).json({ success: true })
  } catch (error) {
    console.error("Webhook Error:", error)
    return res.status(400).json({ success: false, message: "Invalid signature" })
  }
}

module.exports = { clerkWebhook }