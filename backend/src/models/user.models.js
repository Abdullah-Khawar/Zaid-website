import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    
    email: { 
        type: String, 
        required: true, 
        unique: true, 
        lowercase: true, 
        trim: true 
    },

    password: { 
        type: String, 
        minlength: 6 // Password required only for manual signup
    },

    googleId: { 
        type: String, 
        unique: true, 
        sparse: true // Allows some users to have it and others not
    },

    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        required: false 
    },

    phone: { 
        type: String, 
        required: false 
    },

    role: { 
        type: String, 
        enum: ['customer', 'admin'], 
        default: 'customer' 
    },
    resetPasswordCode: { type: String }, 
    resetPasswordExpires: { type: Date }
}, { timestamps: true });



userSchema.pre('save', async function (next) {
    if (this.isModified('password') && this.password) {  // Ensure password exists
        if (typeof this.password === 'string' && !this.password.startsWith('$2b$')) { 
            this.password = await bcrypt.hash(this.password, 10);
        }
    }
    next();
});


// Compare hashed password for login
userSchema.methods.comparePassword = async function(candidatePassword) {
    if (!this.password) return false;  // No password for Google users
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
