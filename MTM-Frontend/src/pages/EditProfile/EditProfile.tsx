import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import * as Yup from "yup";
import "./EditProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import profile_logo from "../../pages/assets/profile_logo.png";

interface FormValues {
  name?: string;
  email?: string;
  userType?: string;
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
  const { getUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  const handleProfile = () => {
    navigate("/home/profile");
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = getUser();
        if (currentUser) {
          const userEmail = currentUser.email;

          const response = await fetch(
            `http://localhost:3001/users/v1?email=${userEmail}`,

            {
              method: "GET",
              headers: { "Content-Type": "application/json" },
            },
          );

          if (response.ok) {
            const userData = await response.json();
            setIsLoading(false);

            setValue(
              "name",
              userData.firstName + " " + userData.lastName || "",
            );
            setValue("email", userData.email || "");
            setValue("userType", userData.userType || "");
            setValue("phone", userData.phone || "");
            setValue("address", userData.address || "");
            setValue("city", userData.city || "");
            setValue("zip", userData.zip || "");
          }
        } else {
          throw new Error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [setValue]);

  const onSubmit = async (values: FormValues) => {
    try {
      setError("");

      const firstName = values.name?.split(" ")[0] || "";
      const lastName = values.name?.split(" ")[1] || "";

      const user = {
        firstName,
        lastName,
        email: values.email,
        phone: values.phone,
        address: values.address,
        city: values.city,
        zip: parseInt(values.zip || "0", 10),
        userType: values.userType,
      };

      const response = await fetch(
        `http://localhost:3001/users/v1/update/${values.email}`,
        {
          method: "put",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(user),
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to save registered user data to database: ${response.status}`,
        );
      }

      navigate("/home/profile");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={"edit-profile-container"}>
      <div className={"profile-image"}>
        <img className="profile-logo" src={profile_logo} alt="Image1" />
      </div>
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
              placeholder={"Phone Number"}
              {...register("phone")}
            />{" "}
            {errors.phone && (
              <p className="error-message">{errors.phone.message}</p>
            )}
          </div>
          <p className="text-label">Address</p>
          <input
            className="form-input"
            placeholder={"Street Address"}
            {...register("address")}
          ></input>{" "}
          {errors.address && (
            <p className="error-message">{errors.address.message}</p>
          )}
          <div className={"side-inputs"}>
            <input
              className="form-input-left-half"
              placeholder={"City"}
              {...register("city")}
            ></input>{" "}
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
          <p className="text-label">Agency (optional)</p>
          <input
            className="form-input"
            placeholder={"Organization/Affiliation"}
            {...register("userType")}
          ></input>{" "}
          {errors.userType && (
            <p className="error-message">{errors.userType.message}</p>
          )}
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
