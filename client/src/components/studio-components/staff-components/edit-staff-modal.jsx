/* eslint-disable react/prop-types */
import { X, Info, Trash2, Camera, Upload } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import toast from "react-hot-toast"
import useCountries from "../../../hooks/useCountries";
import DatePickerField from "../../shared/DatePickerField";
import ColorPickerModal from "../../shared/ColorPickerModal";
import CustomSelect from "../../shared/CustomSelect";
import { useDispatch } from "react-redux";
import { fetchAllStaffThunk, updateStaffThunk } from "../../../features/staff/staffSlice";

// Initials Avatar Component - Blue background with initials (like members)
const InitialsAvatar = ({ firstName, lastName, size = "md", className = "" }) => {
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || ""
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || ""
    return `${firstInitial}${lastInitial}` || "?"
  }

  const sizeClasses = {
    sm: "w-9 h-9 text-sm",
    md: "w-12 h-12 text-lg",
    lg: "w-24 h-24 text-3xl",
  }

  return (
    <div
      className={`bg-secondary rounded-xl flex items-center justify-center text-white font-semibold flex-shrink-0 ${sizeClasses[size]} ${className}`}
      style={{ fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
    >
      {getInitials()}
    </div>
  )
}

// Camera Modal Component
const CameraModal = ({ isOpen, onClose, onCapture }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const [stream, setStream] = useState(null)
  const [error, setError] = useState(null)
  const [facingMode, setFacingMode] = useState("user")

  useEffect(() => {
    if (isOpen) {
      startCamera()
    }
    return () => {
      stopCamera()
    }
  }, [isOpen, facingMode])

  const startCamera = async () => {
    try {
      setError(null)
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: facingMode }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
    } catch (err) {
      console.error("Error accessing camera:", err)
      setError("Could not access camera. Please ensure you have granted camera permissions.")
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0)

      // Convert canvas to blob
      canvas.toBlob((blob) => {
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        onCapture(file);
      }, 'image/jpeg', 0.8);

      stopCamera()
      onClose()
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === "user" ? "environment" : "user")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[1100] p-4">
      <div className="bg-surface-card rounded-xl w-full max-w-md overflow-hidden">
        <div className="flex justify-between items-center p-4 border-b border-border">
          <h3 className="text-content-primary font-semibold">Take Photo</h3>
          <button onClick={() => { stopCamera(); onClose(); }} className="text-content-muted hover:text-content-primary">
            <X size={20} />
          </button>
        </div>

        <div className="p-4">
          {error ? (
            <div className="text-center py-8">
              <p className="text-red-400 text-sm mb-4">{error}</p>
              <button
                onClick={startCamera}
                className="px-4 py-2 bg-surface-button text-content-primary rounded-xl text-sm"
              >
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div className="relative bg-black rounded-xl overflow-hidden aspect-square mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
              </div>
              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-3">
                <button
                  onClick={toggleCamera}
                  className="flex-1 py-2.5 bg-surface-button hover:bg-surface-button-hover text-content-primary rounded-xl text-sm flex items-center justify-center gap-2"
                >
                  <Camera size={16} />
                  Flip
                </button>
                <button
                  onClick={handleCapture}
                  className="flex-[2] py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl text-sm font-medium"
                >
                  Capture Photo
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function EditStaffModal({
  staff,
  setIsShowDetails,
  setSelectedStaff,
  staffMembers,
  setStaffMembers,
  handleRemovalStaff,
}) {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("details")
  const { countries, loading } = useCountries();
  const [editedStaff, setEditedStaff] = useState({
    ...staff,
    about: staff.description || staff.about || "",
    color: staff.color && !staff.color.startsWith("var(") ? staff.color : "#6366f1",
    phone: staff.phone || "",
    telephone: staff.telephone || "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [showCameraModal, setShowCameraModal] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)

  // Reset state when staff changes
  useEffect(() => {
    if (staff) {
      setEditedStaff({
        ...staff,
        about: staff.description || staff.about || "",
        color: staff.color && !staff.color.startsWith("var(") ? staff.color : "#6366f1",
        phone: staff.phone || "",
        telephone: staff.telephone || "",
      })
      setActiveTab("details")
      setIsChangingPassword(false)
      setNewPassword("")
    }
  }, [staff])

  const [imagePreview, setImagePreview] = useState(null);


  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditedStaff((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhoneChange = (e) => {
    const { name, value } = e.target
    // Only allow numbers and + sign
    const sanitized = value.replace(/[^0-9+]/g, '')
    setEditedStaff((prev) => ({ ...prev, [name]: sanitized }))
  }

  const handleColorChange = (e) => {
    setEditedStaff((prev) => ({ ...prev, color: e.target.value }))
  }

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword)
  }

  const handleImgUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditedStaff({ ...editedStaff, img: file });

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = (file) => {
    setEditedStaff((prev) => ({ ...prev, img: file }));

    // Create preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setEditedStaff((prev) => ({ ...prev, img: null }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Create FormData for file upload
    const formData = new FormData()

    // Append all fields individually - DON'T append the whole object
    formData.append('firstName', editedStaff.firstName || '')
    formData.append('lastName', editedStaff.lastName || '')
    formData.append('email', editedStaff.email || '')
    formData.append('phone', editedStaff.phone || '')
    formData.append('telephone', editedStaff.telephoneNumber || editedStaff.telephone || '')
    formData.append('dateOfBirth', editedStaff.dateOfBirth || '')
    formData.append('gender', editedStaff.gender || '')
    formData.append('street', editedStaff.street || '')
    formData.append('zipCode', editedStaff.zipCode || '')
    formData.append('city', editedStaff.city || '')
    formData.append('country', editedStaff.country || '')
    formData.append('staffRole', editedStaff.staffRole || '')
    formData.append('about', editedStaff.about || '')
    formData.append('description', editedStaff.about || '') // For backward compatibility
    formData.append('vacationDays', editedStaff.vacationDays || 30)
    formData.append('staffColor', editedStaff.color || '#6366f1')
    formData.append('username', editedStaff.username || '')

    // Handle password if changing
    if (isChangingPassword && newPassword) {
      formData.append('password', newPassword)
    }

    // Handle image upload - Check if it's a File object
    if (editedStaff.img instanceof File) {
      // New image uploaded
      formData.append('img', editedStaff.img)
      // console.log('Uploading new image:', editedStaff.img.name)
    } else if (editedStaff.img === null) {
      // Image was removed
      formData.append('removeImage', 'true')
    } else if (editedStaff.img && typeof editedStaff.img === 'object') {
      // Existing image object (from database) - send as JSON string
      formData.append('img', JSON.stringify(editedStaff.img))
    }

    // // Debug: log FormData contents
    // console.log('Submitting FormData:')
    // for (let pair of formData.entries()) {
    //   console.log(pair[0] + ': ' + (pair[0] === 'img' && pair[1] instanceof File ? '[File]' : pair[1]))
    // }

    // Get the correct staff ID
    const staffId = editedStaff._id || editedStaff.id
    if (!staffId) {
      toast.error("Staff ID not found")
      return
    }

    // Dispatch to Redux thunk
    dispatch(updateStaffThunk({
      staffId: staffId,
      updateData: formData  // Send FormData, not the object
    }))
    .unwrap()
    toast.success("Staff updated successfully")
    await dispatch(fetchAllStaffThunk());
  }

  const handleClose = () => {
    setIsShowDetails(false)
    setSelectedStaff(null)
  }

  const tabs = [
    { id: "details", label: "Details" },
    { id: "access", label: "Access Data" },
  ]



  return (
    <div className="fixed open_sans_font inset-0 bg-black/50 flex items-center p-2 md:p-0 justify-center z-[1000] overflow-y-auto">
      <div className="bg-surface-card p-4 md:p-6 rounded-xl w-full max-w-md my-4 md:my-8 relative max-h-[85dvh] max-h-[85vh] md:max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl text-content-primary font-bold">Edit Staff</h2>
          <button
            onClick={handleClose}
            className="text-content-muted hover:text-content-primary transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${activeTab === tab.id
                ? "text-primary border-b-2 border-primary"
                : "text-content-muted hover:text-content-primary"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1">
            {activeTab === "details" && (
              <>
                {/* Avatar Upload */}
                <div className="flex flex-col items-start">
                  <div className="w-24 h-24 rounded-xl overflow-hidden mb-4 relative">
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                        {/* Remove button on image */}
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 text-white p-1.5 rounded-lg transition-colors"
                          title="Remove image"
                        >
                          <X size={14} />
                        </button>
                      </>
                    ) : (
                      <InitialsAvatar
                        firstName={editedStaff.firstName}
                        lastName={editedStaff.lastName}
                        size="lg"
                      />
                    )}
                  </div>

                  {/* Image action buttons */}
                  <div className="flex flex-wrap gap-2">
                    <input
                      type="file"
                      id="edit-avatar"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImgUpload}
                    />
                    <label
                      htmlFor="edit-avatar"
                      className="bg-primary hover:bg-primary-hover px-4 py-2 rounded-xl text-sm cursor-pointer text-white flex items-center gap-2"
                    >
                      <Upload size={16} />
                      Upload
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowCameraModal(true)}
                      className="bg-surface-button hover:bg-surface-button-hover px-4 py-2 rounded-xl text-sm text-content-primary flex items-center gap-2"
                    >
                      <Camera size={16} />
                      Camera
                    </button>
                  </div>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Personal Information</div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">
                        First Name<span className="text-accent-red ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={editedStaff.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">
                        Last Name<span className="text-accent-red ml-1">*</span>
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={editedStaff.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">
                      Email<span className="text-accent-red ml-1">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editedStaff.email || ""}
                      onChange={handleInputChange}
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">
                        Mobile Number<span className="text-accent-red ml-1">*</span>
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={editedStaff.phone}
                        onChange={handlePhoneChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Telephone Number</label>
                      <input
                        type="tel"
                        name="telephone"
                        value={editedStaff.telephone}
                        onChange={handlePhoneChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Birthday</label>
                      <div className="w-full flex items-center justify-between bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent">
                        <span className={editedStaff.dateOfBirth ? "text-content-primary" : "text-content-faint"}>
                          {editedStaff.dateOfBirth
                            ? new Date(editedStaff.dateOfBirth).toLocaleDateString()
                            : "Select date"}
                        </span>
                        <DatePickerField value={editedStaff.dateOfBirth || ""} onChange={(val) => setEditedStaff(prev => ({ ...prev, dateOfBirth: val }))} />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">Gender</label>
                      <CustomSelect
                        name="gender"
                        value={editedStaff.gender || ""}
                        onChange={handleInputChange}
                        placeholder="Select gender"
                        options={[
                          { value: "male", label: "Male" },
                          { value: "female", label: "Female" },
                          { value: "other", label: "Other" },
                        ]}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Address</div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">Street</label>
                    <input
                      type="text"
                      name="street"
                      value={editedStaff.street || ""}
                      onChange={handleInputChange}
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">ZIP Code</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={editedStaff.zipCode || ""}
                        onChange={handleInputChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-content-secondary block mb-2">City</label>
                      <input
                        type="text"
                        name="city"
                        value={editedStaff.city || ""}
                        onChange={handleInputChange}
                        className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">Country</label>
                    <CustomSelect
                      name="country"
                      value={editedStaff.country || ""}
                      onChange={handleInputChange}
                      placeholder={loading ? "Loading countries..." : "Select a country"}
                      searchable
                      options={countries.map((country) => ({
                        value: country.name,
                        label: country.name,
                      }))}
                      disabled={loading}
                    />
                  </div>
                </div>

                {/* Employment */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Employment</div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">
                      Role<span className="text-accent-red ml-1">*</span>
                    </label>
                    <CustomSelect
                      name="staffRole"
                      value={editedStaff.staffRole || ""}
                      onChange={handleInputChange}
                      placeholder="Select role"
                      required
                      options={[
                        { value: "admin", label: "Admin" },
                        { value: "manager", label: "Manager" },
                        { value: "employee", label: "Employee" },
                      ]}
                    />
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">Staff Identification Color</label>
                    <button
                      type="button"
                      onClick={() => setShowColorPicker(true)}
                      className="w-full flex items-center gap-3 bg-surface-dark rounded-xl px-4 py-2 text-sm border border-transparent hover:border-border transition-colors"
                    >
                      <div className="w-6 h-6 rounded-lg border border-border flex-shrink-0" style={{ backgroundColor: editedStaff.color }} />
                      <span className="text-content-primary">{editedStaff.color}</span>
                    </button>
                  </div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2 flex items-center gap-2">
                      Vacation Entitlement per Year (Days)
                      <div className="relative group">
                        <Info size={14} className="text-content-faint cursor-help" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-surface-dark text-content-primary text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-10 pointer-events-none">
                          Changes will take effect next year
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-surface-dark"></div>
                        </div>
                      </div>
                    </label>
                    <input
                      type="number"
                      name="vacationDays"
                      value={editedStaff.vacationDays || 30}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-surface-dark text-sm rounded-xl px-4 py-2 text-content-primary outline-none border border-transparent focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4 pt-4 border-t border-border">
                  <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Additional Information</div>

                  <div>
                    <label className="text-sm text-content-secondary block mb-2">About</label>
                    <textarea
                      name="about"
                      value={editedStaff.about || ""}
                      onChange={handleInputChange}
                      placeholder="Enter more details..."
                      className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm resize-none min-h-[100px] border border-transparent focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {activeTab === "access" && (
              <div className="space-y-4">
                <div className="text-xs text-content-muted uppercase tracking-wider font-semibold">Login Credentials</div>

                <div>
                  <label className="text-sm text-content-secondary block mb-2">
                    Username<span className="text-accent-red ml-1">*</span>
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={editedStaff.username || ""}
                    onChange={handleInputChange}
                    className="w-full bg-surface-dark rounded-xl px-4 py-2 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm text-content-secondary block mb-2">Password</label>
                  <div className="relative">
                    {isChangingPassword ? (
                      <div className="space-y-2">
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-surface-dark rounded-xl px-4 py-2 pr-20 text-content-primary outline-none text-sm border border-transparent focus:border-primary transition-colors"
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={handlePasswordToggle}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-content-muted hover:text-content-primary"
                          >
                            {showPassword ? "Hide" : "Show"}
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setIsChangingPassword(false)
                            setNewPassword("")
                          }}
                          className="text-sm text-content-muted hover:text-content-primary"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-3">
                        <input
                          type="password"
                          value="********"
                          disabled
                          className="flex-1 bg-surface-dark rounded-xl px-4 py-2 text-content-faint outline-none text-sm"
                        />
                        <button
                          type="button"
                          onClick={() => setIsChangingPassword(true)}
                          className="text-sm text-primary hover:text-primary/80 whitespace-nowrap transition-colors"
                        >
                          Change Password
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Delete button on the left */}
          <div className="flex flex-col-reverse sm:flex-row justify-between gap-2 pt-4 mt-auto flex-shrink-0">
            <button
              type="button"
              onClick={() => handleRemovalStaff(editedStaff)}
              className="px-4 py-2.5 sm:py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-colors flex items-center justify-center sm:justify-start gap-1"
            >
              <Trash2 size={16} />
              Delete
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm bg-surface-button text-content-primary rounded-xl hover:bg-surface-button-hover transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 sm:flex-none px-4 py-2.5 sm:py-2 text-sm text-white rounded-xl bg-primary hover:bg-primary-hover transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Camera Modal */}
      <CameraModal
        isOpen={showCameraModal}
        onClose={() => setShowCameraModal(false)}
        onCapture={handleCameraCapture}
      />
      <ColorPickerModal
        isOpen={showColorPicker}
        onClose={() => setShowColorPicker(false)}
        onSelectColor={(color) => setEditedStaff(prev => ({ ...prev, color }))}
        currentColor={editedStaff.color}
        title="Staff Identification Color"
      />
    </div>
  )
}

export default EditStaffModal