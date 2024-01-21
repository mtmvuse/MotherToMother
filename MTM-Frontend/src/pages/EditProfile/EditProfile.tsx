import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as Yup from "yup";
import "./EditProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getUserData, updateUser } from "../../lib/services";
import { ErrorMessage } from "../../components/Error";
import { CircularProgress } from "@mui/material";
import type { UserType } from "../../types/UserTypes";

interface FormValues {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  zip?: string;
}

const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^([A-Za-z]+\s[A-Za-z]+)$/, "First and Last name")
    .required("First and Last name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  userType: Yup.string().required("Type is required"),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number is not valid")
    .required("Phone number is required"),
  address: Yup.string().required("Address is required"),
  zip: Yup.string()
    .matches(/^\d{5}(-\d{4})?$/, "Invalid Zip code")
    .required("Zip code is required"),
  city: Yup.string().required("City is required"),
  agency: Yup.string(),
});

const EditProfile: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string | null>(null);

  const handleProfile = () => {
    navigate("/home/profile");
  };
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await currentUser?.getIdToken();

        if (!currentUser) {
          throw new Error("Failed to fetch user data");
        }

        const userEmail = currentUser.email;

        if (!userEmail) {
          throw new Error("User email not found");
        }

        const response = await getUserData(userEmail, token);

        if (!response.ok) {
          throw new Error("Error fetching user");
        }

        const userData = (await response.json()) as UserType;

        setIsLoading(false);
        setValue("name", `${userData.firstName} ${userData.lastName}` || "");
        setValue("email", userData.email || "");
        setValue("userType", userData.userType || "");
        setValue("phone", userData.phone || "");
        setValue("address", userData.address || "");
        setValue("city", userData.city || "");
        setValue("zip", userData.zip || "");
      } catch (error: any) {
        console.error("Error fetching user:", error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [currentUser, setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");
      const token = await currentUser?.getIdToken();

      const firstName = values.name?.split(" ")[0];
      const lastName = values.name?.split(" ")[1];

      const user = {
        firstName,
        lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        zip: parseInt(values.zip ?? "00000"),
      };

      if (!values.email) {
        throw new Error("Email not found");
      }

      const response = await updateUser(values.email, user, token);
      if (!response.ok) {
        throw new Error("Error updating user");
      } else {
        navigate("/home/profile");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return isLoading ? (
    <CircularProgress />
  ) : (
    <div className={"edit-profile-container"}>
      <ErrorMessage error={error} setError={setError} />
      <div className={"edit-form"}>
        <form id="edit-form" onSubmit={handleSubmit(onSubmit)}>
          <p className="text-label">Basic Information</p>
          <input
            className="form-input"
            placeholder="Name"
            {...register("name")}
          ></input>
          {errors?.name && (
            <p className="error-message">{errors.name.message}</p>
          )}
          <p className="text-label">Contact</p>
          <div className="vertical-input-container">
            <input
              className="form-input"
              placeholder={"Email address"}
              {...register("email")}
              readOnly
              onFocus={(e) => e.target.blur()}
            />
            {errors.email && (
              <p className="error-message">{errors.email.message}</p>
            )}
            <input
              className="form-input"
              placeholder={"*Phone Number"}
              {...register("phone")}
            />
            {errors.phone && (
              <p className="error-message">{errors.phone.message}</p>
            )}
          </div>
          <p className="text-label">Address</p>
          <input
            className="form-input"
            placeholder={"Street Address"}
            {...register("address")}
          ></input>
          {errors.address && (
            <p className="error-message">{errors.address.message}</p>
          )}
          <div className={"side-inputs"}>
            <input
              className="form-input-left-half"
              placeholder={"City"}
              {...register("city")}
            ></input>
            {errors.city && (
              <p className="error-message">{errors.city.message}</p>
            )}
            <input
              className="form-input-right-half"
              placeholder={"Zip"}
              {...register("zip")}
            ></input>
            {errors.zip && (
              <p className="error-message">{errors.zip.message}</p>
            )}
          </div>
        </form>
      </div>

      <div className={"buttons-container"}>
        <button className={"save-button"} type="submit" form="edit-form">
          {isSubmitting ? "Submitting" : "Save"}
        </button>
        <button className={"cancel-button"} onClick={handleProfile}>
          Cancel
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
