import { useForm } from "react-hook-form";
import { useState, useRef, useEffect } from "react";

import Input from "../../components/admin/Input";
import Form from "../../components/admin/Form";
import Button from "../../components/admin/Button";
import { Textarea } from "../../components/admin/Textarea";
import FormRow from "../../components/admin/FormRow";
import { useCreateService } from "./useCreateService";
import { useEditService } from "./useEditService";

function CreateServiceForm({ serviceToEdit = {}, onCloseModal }) {
  const { isCreating, createService } = useCreateService();
  const { isEditing, editService } = useEditService();
  const isWorking = isCreating || isEditing;

  const { id: editId, ...editValues } = serviceToEdit;
  const isEditSession = Boolean(editId);

  const [imagePreview, setImagePreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (isEditSession && serviceToEdit.photoService?.url && !imagePreview) {
      setImagePreview(serviceToEdit.photoService.url);
    }
  }, [isEditSession, serviceToEdit.photoService?.url, imagePreview]);

  const defaultValues = isEditSession
    ? {
        nameService: editValues.nameService || "",
        Unit: editValues.Unit || "",
        priceService: editValues.priceService || "",
        priceDiscount: editValues.priceDiscount || 0,
        summary: editValues.summary || "",
        description: editValues.description || "",
      }
    : {
        nameService: "",
        Unit: "",
        priceService: "",
        priceDiscount: 0,
        summary: "",
        description: "",
      };

  const { register, handleSubmit, reset, getValues, formState, setValue } =
    useForm({
      defaultValues,
    });
  const { errors } = formState;

  function onSubmit(data) {
    if (!isEditSession && !selectedFile) {
      toast.error("Please select a service photo");
      return;
    }

    const formData = new FormData();

    formData.append("nameService", data.nameService);
    formData.append("Unit", data.Unit);
    formData.append("priceService", String(data.priceService));
    formData.append("priceDiscount", String(data.priceDiscount || 0));
    formData.append("summary", data.summary || "");
    formData.append("description", data.description || "");
    if (selectedFile) {
      formData.append("photoService", selectedFile);
    } else if (!isEditSession) {
      toast.error("Please select a service photo");
      return;
    }
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    if (isEditSession) {
      editService(
        {
          newServiceData: formData,
          id: editId,
        },
        {
          onSuccess: () => {
            handleReset();
            onCloseModal?.();
          },
        }
      );
    } else {
      createService(formData, {
        onSuccess: () => {
          handleReset();
          onCloseModal?.();
        },
      });
    }
  }

  function onError(errors) {
    const firstError = Object.values(errors)[0];
    if (firstError?.message) {
      alert(firstError.message);
    }
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    console.log("Selected file:", file);

    if (file) {
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setSelectedFile(null);
        setImagePreview(
          isEditSession && serviceToEdit.photoService?.url
            ? serviceToEdit.photoService.url
            : null
        );
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setSelectedFile(null);
        setImagePreview(
          isEditSession && serviceToEdit.photoService?.url
            ? serviceToEdit.photoService.url
            : null
        );
        return;
      }

      setSelectedFile(file);
      setValue("photoService", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  function openFileDialog() {
    if (fileInputRef.current && !isWorking) {
      fileInputRef.current.click();
    }
  }

  function removeImage() {
    if (isEditSession && serviceToEdit.photoService?.url) {
      setImagePreview(serviceToEdit.photoService.url);
      setSelectedFile(null);
    } else {
      setImagePreview(null);
      setSelectedFile(null);
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setValue("photoService", null);
  }

  function handleReset() {
    reset(defaultValues);
    setImagePreview(
      isEditSession && serviceToEdit.photoService?.url
        ? serviceToEdit.photoService.url
        : null
    );
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  return (
    <Form
      onSubmit={handleSubmit(onSubmit, onError)}
      type={onCloseModal ? "modal" : "regular"}
    >
      <FormRow label="Service name" error={errors?.nameService?.message}>
        <Input
          type="text"
          id="nameService"
          disabled={isWorking}
          {...register("nameService", {
            required: "This field is required",
            minLength: {
              value: 2,
              message: "Service name must be at least 2 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Unit" error={errors?.Unit?.message}>
        <Input
          type="text"
          id="Unit"
          disabled={isWorking}
          placeholder="e.g., Session, Visit, Treatment"
          {...register("Unit", {
            required: "This field is required",
          })}
        />
      </FormRow>

      <FormRow label="Service price" error={errors?.priceService?.message}>
        <Input
          type="number"
          id="priceService"
          disabled={isWorking}
          step="0.01"
          {...register("priceService", {
            required: "This field is required",
            min: {
              value: 1,
              message: "Price should be at least 1",
            },
            valueAsNumber: true,
          })}
        />
      </FormRow>

      <FormRow label="Discount price" error={errors?.priceDiscount?.message}>
        <Input
          type="number"
          id="priceDiscount"
          disabled={isWorking}
          step="0.01"
          {...register("priceDiscount", {
            valueAsNumber: true,
            validate: (value) => {
              const servicePrice = getValues().priceService;
              if (value && value < 0) {
                return "Discount price cannot be negative";
              }
              if (value && servicePrice && value >= servicePrice) {
                return "Discount price should be less than service price";
              }
              return true;
            },
          })}
        />
      </FormRow>

      <FormRow label="Summary" error={errors?.summary?.message}>
        <Input
          type="text"
          id="summary"
          disabled={isWorking}
          placeholder="Brief summary of the service"
          {...register("summary", {
            maxLength: {
              value: 200,
              message: "Summary cannot exceed 200 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Description" error={errors?.description?.message}>
        <Textarea
          id="description"
          disabled={isWorking}
          placeholder="Detailed description of the service"
          rows={4}
          {...register("description", {
            required: "This field is required",
            maxLength: {
              value: 1000,
              message: "Description cannot exceed 1000 characters",
            },
          })}
        />
      </FormRow>

      <FormRow label="Service photo" error={errors?.photoService?.message}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {imagePreview && (
            <div
              style={{
                position: "relative",
                display: "inline-block",
                marginBottom: "1rem",
              }}
            >
              <img
                src={imagePreview}
                alt="Service preview"
                style={{
                  width: "200px",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  border: "2px solid #e2e8f0",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                }}
              />
              <button
                type="button"
                onClick={removeImage}
                disabled={isWorking}
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-8px",
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: "none",
                  backgroundColor: "#ef4444",
                  color: "white",
                  cursor: isWorking ? "not-allowed" : "pointer",
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                }}
                title="Remove image"
              >
                ×
              </button>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: "none" }}
            disabled={isWorking}
          />

          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              alignItems: "center",
              flexWrap: "wrap",
            }}
          >
            <span
              type="button"
              onClick={openFileDialog}
              disabled={isWorking}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "10px 16px",
                backgroundColor: isWorking
                  ? "#6b7280"
                  : imagePreview
                  ? "#10b981"
                  : "#3b82f6",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: isWorking ? "not-allowed" : "pointer",
                fontSize: "14px",
                fontWeight: "500",
                textAlign: "center",
                transition: "all 0.2s ease",
                userSelect: "none",
                opacity: isWorking ? 0.6 : 1,
              }}
              onMouseEnter={(e) => {
                if (!isWorking) {
                  e.target.style.backgroundColor = imagePreview
                    ? "#059669"
                    : "#2563eb";
                  e.target.style.transform = "translateY(-1px)";
                }
              }}
              onMouseLeave={(e) => {
                if (!isWorking) {
                  e.target.style.backgroundColor = imagePreview
                    ? "#10b981"
                    : "#3b82f6";
                  e.target.style.transform = "translateY(0)";
                }
              }}
            >
              <span style={{ fontSize: "16px" }}>
                {imagePreview ? "✓" : "📁"}
              </span>
              {isEditSession
                ? imagePreview
                  ? "Change Photo"
                  : "Choose Photo"
                : imagePreview
                ? "Photo Selected"
                : "Choose Photo"}
            </span>

            {selectedFile && (
              <span
                style={{
                  fontSize: "12px",
                  color: "#6b7280",
                  padding: "4px 8px",
                  backgroundColor: "#f3f4f6",
                  borderRadius: "4px",
                  maxWidth: "200px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {selectedFile.name}
              </span>
            )}
          </div>
          <input
            type="hidden"
            {...register("photoService", {
              validate: () => {
                if (!isEditSession && !selectedFile) {
                  return "Please select a service photo";
                }
                return true;
              },
            })}
          />

          <div style={{ fontSize: "12px", color: "#6b7280" }}>
            <p style={{ margin: 0 }}>
              • Supported formats: JPG, PNG, GIF, WebP
            </p>
            <p style={{ margin: 0 }}>• Maximum file size: 5MB</p>
            <p style={{ margin: 0 }}>• Recommended dimensions: 600x400px</p>
            {!isEditSession && (
              <p style={{ margin: 0, color: "#ef4444", fontWeight: "500" }}>
                • Photo is required for new services
              </p>
            )}
          </div>
        </div>
      </FormRow>

      <FormRow>
        <Button
          variation="secondary"
          type="button"
          onClick={() => {
            onCloseModal?.();
          }}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isWorking}>
          {isWorking
            ? isEditSession
              ? "Updating..."
              : "Creating..."
            : isEditSession
            ? "Update Service"
            : "Create Service"}
        </Button>
      </FormRow>
    </Form>
  );
}

export default CreateServiceForm;
