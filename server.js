/* eslint-disable no-undef */
import express from "express";
// eslint-disable-next-line no-unused-vars
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Supabase client with Service Role Key
const supabaseAdmin = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_SERVICE_ROLE_KEY
);

// =====================================
//  CREATE DOCTOR

app.post("/createDoctor", async (req, res) => {
    try {
        const { email, password, fullName, specialty } = req.body;

        if (!email || !password || !fullName || !specialty)
            return res.status(400).json({ error: "Missing fields" });

        console.log("📝 Creating doctor with email:", email);

        //  Create Auth user
        const { data: userData, error: signUpError } =
            await supabaseAdmin.auth.admin.createUser({
                email,
                password,
                email_confirm: true,
            });

        if (signUpError) {
            console.error(" Auth error:", signUpError);
            throw signUpError;
        }

        const userId = userData?.user?.id;

        if (!userId) throw new Error("Failed to get user ID from auth");
        console.log(" Auth user created with ID:", userId);

        // Insert into users table (IMPORTANT: Use insert not update)
        const { data: insertData, error: insertError } = await supabaseAdmin
            .from("users")
            .insert({
                id: userId,
                email: email,
                name: fullName,
                specialty: specialty,
                role: "doctor",
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select();

        if (insertError) {
            console.error(" Users table insert error:", insertError);

            // Delete auth user if insert fails
            await supabaseAdmin.auth.admin.deleteUser(userId);
            throw insertError;
        }

        console.log(" Doctor profile inserted:", insertData);

        res.json({
            success: true,
            userId,
            email,
            fullName,
            specialty,
            message: "Doctor created successfully"
        });

    } catch (err) {
        console.error(" Error in createDoctor:", err.message);
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});

// =====================================
// DELETE DOCTOR

app.delete("/deleteDoctor/:doctorId", async (req, res) => {
    try {
        const { doctorId } = req.params;

        if (!doctorId)
            return res.status(400).json({ error: "Doctor ID required" });

        console.log("🗑️ Deleting doctor with ID:", doctorId);

        //  Delete appointments
        const { error: appointmentsError } = await supabaseAdmin
            .from("appointments")
            .delete()
            .eq("doctor_id", doctorId);

        if (appointmentsError) {
            console.error(" Appointments deletion error:", appointmentsError);
            throw appointmentsError;
        }
        console.log(" Appointments deleted");

        // Delete from users table
        const { error: usersError } = await supabaseAdmin
            .from("users")
            .delete()
            .eq("id", doctorId);

        if (usersError) {
            console.error(" Users table deletion error:", usersError);
            throw usersError;
        }
        console.log(" Doctor deleted from users table");

        //  Delete auth user
        const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
            doctorId
        );

        if (authError) {
            console.error(" Auth deletion error:", authError);
            throw authError;
        }
        console.log(" Auth user deleted");

        res.json({
            success: true,
            message: "Doctor deleted successfully",
            deletedId: doctorId
        });

    } catch (err) {
        console.error(" Error in deleteDoctor:", err.message);
        res.status(500).json({
            error: err.message,
            success: false
        });
    }
});

// =====================================
// Start server

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});