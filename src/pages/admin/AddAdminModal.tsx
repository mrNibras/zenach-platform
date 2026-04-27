import { useEffect, useState } from "react";
import { X, Shield, UserPlus, Eye, EyeOff, Save } from "lucide-react";

interface AddAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAdmin: (name: string, email: string, password: string) => Promise<void> | void;
  onEditAdmin?: (name: string, email: string, password?: string) => Promise<void> | void;
  initialValues?: {
    name: string;
    email: string;
  };
  mode?: "create" | "edit";
}

export default function AddAdminModal({
  isOpen,
  onClose,
  onAddAdmin,
  onEditAdmin,
  initialValues,
  mode = "create",
}: AddAdminModalProps) {
  const [formData, setFormData] = useState({
    name: initialValues?.name || "",
    email: initialValues?.email || "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    setFormData({
      name: initialValues?.name || "",
      email: initialValues?.email || "",
      password: "",
      confirmPassword: "",
    });
    setShowPassword(false);
    setShowConfirmPassword(false);
    setError("");
  }, [initialValues, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const isEditMode = mode === "edit";

    // Validation
    if (!formData.name || !formData.email || (!isEditMode && !formData.password)) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password && formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isEditMode && onEditAdmin) {
        await onEditAdmin(formData.name, formData.email, formData.password || undefined);
      } else {
        await onAddAdmin(formData.name, formData.email, formData.password);
      }
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setShowPassword(false);
      setShowConfirmPassword(false);
    } catch (error: any) {
      setError(
        error?.response?.data?.message ||
          (isEditMode ? "Unable to update admin" : "Unable to create admin")
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 text-pink-600" />
            <h2 className="text-2xl font-bold">
              {mode === "edit" ? "Edit Admin" : "Add New Admin"}
            </h2>
          </div>
          <button onClick={onClose}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="Enter admin name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:border-pink-500"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:border-pink-500"
                placeholder={mode === "edit" ? "Leave blank to keep current password" : "Minimum 6 characters"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full px-4 py-2 pr-10 border rounded-lg focus:outline-none focus:border-pink-500"
                placeholder={mode === "edit" ? "Only needed when changing password" : "Re-enter password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex space-x-4 mt-6">
            <button
              type="submit"
              className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 flex items-center justify-center space-x-2"
            >
              {mode === "edit" ? <Save className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />}
              <span>{mode === "edit" ? "Save Changes" : "Add Admin"}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
