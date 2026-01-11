/* eslint-disable react/prop-types */
import { X } from "lucide-react"
import ProductImage from "../../../../public/gray-avatar-fotor-20250912192528.png" 

const ProductServiceModal = ({
  isOpen,
  closeModal,
  modalMode,
  activeTab,
  formData,
  handleSubmit,
  handleInputChangeMain,
  selectedImage,
  currentProduct,
  handleImageUpload,
  fileInputRef,
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 cursor-pointer open_sans_font w-full h-full bg-black/50 flex items-center justify-center z-[1000] p-4">
      <div className="bg-[#181818] rounded-xl w-full max-w-md my-8 relative">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-white text-lg open_sans_font_700">
              {modalMode === "add"
                ? `Add ${activeTab === "services" ? "Service" : "Product"}`
                : `Edit ${activeTab === "services" ? "Service" : "Product"}`}
            </h2>
            <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* FORM */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSubmit()
            }}
            className="space-y-3 custom-scrollbar overflow-y-auto max-h-[70vh]"
          >
            {/* Upload Image */}
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 rounded-xl overflow-hidden mb-4">
                {selectedImage || currentProduct?.image ? (
                  <img
                    src={selectedImage || currentProduct?.image || ProductImage}
                    alt={activeTab === "services" ? "Service" : "Product"}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium text-center p-2">
                    {currentProduct?.name || "New Item"}
                  </div>
                )}
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="product-image-upload"
                ref={fileInputRef}
              />
              <label
                htmlFor="product-image-upload"
                className="bg-[#3F74FF] hover:bg-[#3F74FF]/90 transition-colors text-white px-6 py-2 rounded-xl text-sm cursor-pointer"
              >
                Upload picture
              </label>
            </div>

            {/* Name */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">
                {activeTab === "services" ? "Service" : "Product"} name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChangeMain}
                placeholder={`Enter ${activeTab === "services" ? "service" : "product"} name`}
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                required
              />
            </div>

            {/* Conditional Fields */}
            {activeTab === "services" ? (
              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">Price *</label>
                  <div className="flex items-center rounded-xl bg-[#101010] border border-transparent focus-within:border-[#3F74FF] transition-colors">
                    <span className="px-3 text-white text-sm">€</span>
                    <input
                      type="text"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChangeMain}
                      placeholder="0.00"
                      className="w-full bg-transparent text-sm py-3 pr-4 text-white placeholder-gray-500 outline-none"
                      required
                    />
                  </div>
                </div>
                {/* VAT */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">VAT Rate (%)</label>
                  <select
                    name="vatRate"
                    value={formData.vatRate}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  >
                    <option value="7">7% (take-away)</option>
                    <option value="19">19% (eat-in)</option>
                  </select>
                </div>
              </div>
            ) : (
              <>
                {/* Product Fields */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Price *</label>
                    <div className="flex items-center rounded-xl bg-[#101010] border border-transparent focus-within:border-[#3F74FF] transition-colors">
                      <span className="px-3 text-white text-sm">€</span>
                      <input
                        type="text"
                        name="price"
                        value={formData.price}
                        onChange={handleInputChangeMain}
                        placeholder="0.00"
                        className="w-full bg-transparent text-sm py-3 pr-4 text-white placeholder-gray-500 outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-gray-200 block mb-2">Article Number</label>
                    <input
                      type="text"
                      name="articalNo"
                      value={formData.articalNo}
                      onChange={handleInputChangeMain}
                      placeholder="Enter article no"
                      className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                    />
                  </div>
                </div>

                {/* VAT */}
                <div>
                  <label className="text-sm text-gray-200 block mb-2">VAT Rate (%)</label>
                  <select
                    name="vatRate"
                    value={formData.vatRate}
                    onChange={handleInputChangeMain}
                    className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                  >
                    <option value="7">7% (take-away)</option>
                    <option value="19">19% (eat-in)</option>
                  </select>
                </div>
              </>
            )}

            {/* Brand (Products Only) */}
            {activeTab === "products" && (
              <div>
                <label className="text-sm text-gray-200 block mb-2">Brand</label>
                <input
                  type="text"
                  name="brandName"
                  value={formData.brandName}
                  onChange={handleInputChangeMain}
                  placeholder="Enter brand name"
                  className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-gray-400 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
                />
              </div>
            )}

            {/* Link */}
            <div>
              <label className="text-sm text-gray-200 block mb-2">Link (Optional)</label>
              <input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleInputChangeMain}
                placeholder="https://example.com"
                className="w-full bg-[#101010] text-sm rounded-xl px-4 py-3 text-white placeholder-gray-500 outline-none border border-transparent focus:border-[#3F74FF] transition-colors"
              />
            </div>

            {/* Buttons */}
            <div className="flex flex-row gap-3 pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-2.5 bg-[#3F74FF] text-sm text-white rounded-xl hover:bg-[#3F74FF]/90 transition-colors"
              >
                Save
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="w-full sm:w-auto px-8 py-2.5 bg-transparent text-sm text-white rounded-xl border border-[#333333] hover:bg-[#101010] transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProductServiceModal
