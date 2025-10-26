'use client';

import { useState, useCallback, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, ChevronLeft, ChevronRight, Check, Download, Maximize2, Sparkles, Loader2, X } from 'lucide-react';
import Image from 'next/image';
import { ProductVariant } from '@/lib/types';
import { cacheStorage } from '@/lib/cache-storage';

interface TryOnModalProps {
  open: boolean;
  onClose: () => void;
  productTitle: string;
  productType: string;
  variants: ProductVariant[];
}

const loadingMessages = [
  "Preparing your virtual fitting room... ✨",
  "Doing the last touches... 🎨",
  "Cleaning the fitting room... 🧹",
  "Adjusting the perfect lighting... 💡",
  "Getting the best angle... 📸",
  "Adding some magic... ⭐",
  "Almost ready to shine... 🌟",
  "Putting the final touches... 🖌️",
  "Making everything perfect... 💫"
];

export function TryOnModal({ open, onClose, productTitle, productType, variants }: TryOnModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [resultImageUrl, setResultImageUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [fullscreenImage, setFullscreenImage] = useState<string>('');

  // Rotate loading messages
  useEffect(() => {
    if (!isProcessing) return;

    let index = 0;
    const interval = setInterval(() => {
      index = (index + 1) % loadingMessages.length;
      setLoadingMessage(loadingMessages[index]);
    }, 4000);

    return () => clearInterval(interval);
  }, [isProcessing]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setError('Image size must be less than 8MB');
      return;
    }

    setError('');
    setUploadedFile(file);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && uploadedFile) {
      setCurrentStep(2);
    } else if (currentStep === 2 && selectedVariant) {
      setCurrentStep(3);
      generateTryOn();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateTryOn = async () => {
    if (!uploadedFile || !selectedVariant) return;

    setIsProcessing(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('userPhoto', uploadedFile);
      formData.append('productImageUrl', selectedVariant.image);
      formData.append('productType', productType);
      formData.append('productTitle', productTitle);
      formData.append('variantTitle', selectedVariant.title);

      const response = await fetch('/api/tryon', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Generation failed');
      }

      setResultImageUrl(data.resultImageUrl);

      cacheStorage.saveCachedResult({
        resultImageUrl: data.resultImageUrl,
        variantTitle: selectedVariant.title,
        productTitle,
      });

    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImageUrl) return;

    const link = document.createElement('a');
    link.href = resultImageUrl;
    link.download = 'virtual-tryon-result.jpg';
    link.click();
  };

  const resetModal = () => {
    setCurrentStep(1);
    setUploadedFile(null);
    setPreviewUrl('');
    setSelectedVariant(null);
    setResultImageUrl('');
    setError('');
    setIsProcessing(false);
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="max-w-4xl max-h-[95vh] overflow-hidden">
          <DialogHeader>
            <div className="flex items-center justify-between">
              {/* Privacy icon on left */}
              <button
                type="button"
                className="p-2 hover:bg-gray-100 rounded-full transition group relative"
                title="Privacy Information"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-gray-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                  <path d="M12 17h.01"></path>
                </svg>
                {/* Privacy tooltip */}
                <div className="absolute left-0 top-full mt-2 w-64 p-3 bg-white rounded-lg shadow-lg border hidden group-hover:block z-50">
                  <p className="text-xs font-semibold mb-1">Your Privacy Matters</p>
                  <p className="text-xs text-gray-600">
                    We don't store or keep your uploaded images. All photos are processed securely and deleted immediately after generating your try-on result.
                  </p>
                </div>
              </button>

              {/* Centered title */}
              <DialogTitle className="flex items-center gap-2 flex-1 justify-center">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                Virtual Try-On
              </DialogTitle>

              {/* Empty div for layout balance */}
              <div className="w-10"></div>
            </div>
          </DialogHeader>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-4 py-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step === currentStep
                      ? 'bg-indigo-500 text-white'
                      : step < currentStep
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step < currentStep ? <Check className="w-4 h-4" /> : step}
                </div>
                <span className="text-sm font-medium">
                  {step === 1 ? 'Upload' : step === 2 ? 'Variant' : 'Preview'}
                </span>
                {step < 3 && <ChevronRight className="w-4 h-4 text-gray-400" />}
              </div>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600 mx-6">
              {error}
            </div>
          )}

          {/* Modal Body - increased height */}
          <div className="px-6 pb-6 overflow-y-auto" style={{ maxHeight: 'calc(95vh - 250px)' }}>
            {/* Step 1: Upload */}
            {currentStep === 1 && (
              <div className="space-y-4">
                {!previewUrl ? (
                  <>
                    <label className="border-2 border-dashed border-gray-300 rounded-lg p-12 flex flex-col items-center justify-center cursor-pointer hover:border-indigo-400 transition">
                      <Upload className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-sm font-medium text-gray-700">
                        Drag & drop or click to upload
                      </p>
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG, or WebP (max 8MB)</p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-900 mb-2">
                        Tips for best results 💡
                      </h4>
                      <ul className="text-xs text-blue-700 space-y-1">
                        <li>• Use a clear, front-facing photo with neutral background</li>
                        <li>• Avoid heavy filters or extreme angles</li>
                        <li>• Ensure good lighting for best results</li>
                      </ul>
                    </div>
                  </>
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={previewUrl}
                      alt="Uploaded photo"
                      width={600}
                      height={400}
                      className="w-full h-auto object-contain"
                    />
                    {/* Change photo button - absolute top right */}
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute top-3 right-3 shadow-lg"
                      onClick={() => {
                        setUploadedFile(null);
                        setPreviewUrl('');
                      }}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Change Photo
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Variant Selection - increased grid height */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Choose a variant</h3>
                <div className="grid grid-cols-2 gap-3" style={{ maxHeight: '500px', overflowY: 'auto' }}>
                  {variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`border-2 rounded-lg p-3 text-left transition ${
                        selectedVariant?.id === variant.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="relative w-full h-32 mb-2 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={variant.image}
                          alt={variant.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <p className="text-sm font-medium">{variant.title}</p>
                      <p className="text-sm text-gray-600">${variant.price}</p>
                      {selectedVariant?.id === variant.id && (
                        <Badge className="mt-2">Selected</Badge>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3: Preview/Result */}
            {currentStep === 3 && (
              <div className="space-y-4">
                {isProcessing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                    <p className="text-sm text-gray-600 text-center transition-opacity">
                      {loadingMessage}
                    </p>
                  </div>
                ) : resultImageUrl ? (
                  <div className="space-y-4">
                    <div className="relative rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={resultImageUrl}
                        alt="Try-on result"
                        width={600}
                        height={600}
                        className="w-full h-auto object-contain"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={handleDownload}
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="secondary"
                          onClick={() => setFullscreenImage(resultImageUrl)}
                          title="Fullscreen"
                        >
                          <Maximize2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="flex justify-between px-6 pb-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={currentStep === 3 && resultImageUrl ? handleClose : handleBack}
              disabled={currentStep === 1 || isProcessing}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              {currentStep === 3 && resultImageUrl ? 'Close' : 'Back'}
            </Button>

            {currentStep < 3 && (
              <Button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !uploadedFile) ||
                  (currentStep === 2 && !selectedVariant)
                }
              >
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            )}

            {currentStep === 3 && resultImageUrl && (
              <Button onClick={handleClose}>
                Done
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Fullscreen overlay */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={() => setFullscreenImage('')}
        >
          <Image
            src={fullscreenImage}
            alt="Fullscreen"
            width={1200}
            height={1200}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setFullscreenImage('')}
            className="absolute top-4 right-4 text-white bg-white/10 rounded-full p-2 hover:bg-white/20"
          >
            ✕
          </button>
        </div>
      )}
    </>
  );
}
