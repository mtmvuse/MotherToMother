import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { useAuth } from "../AuthContext";
import * as Yup from "yup";
import "./EditProfile.css";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import profile_logo from "../pages/assets/profile_logo.png";

interface FormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  userType: string;
}

const schema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  userType: Yup.string().required("Type is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords do not match")
    .required("Confirm password is required"),
});
const EditProfile: React.FC = () => {
  const navigate = useNavigate();

  const handleProfile = () => {
    navigate("/home/profile");
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
  });

  const [error, setError] = useState<string>("");

  // const onSubmit = async (values: FormValues) => {
  //     try {
  //         setError("");
  //         await registerUser(
  //             values.lastName,
  //             values.email,
  //             values.password,
  //             values.userType,
  //         );
  //         navigate("/home");
  //     } catch (err: any) {
  //         // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  //         setError(err.message);
  //     }
  // };

  return (
    <div className={"edit-profile-container"}>
      <div className={"profile-image"}>
        <img className="profile-logo" src={profile_logo} alt="Image1" />
      </div>
      <div className={"edit-form"}>
        <p className="text-label">Basic Information</p>
        <input className="form-input" placeholder="Name"></input>
          <p className="text-label">Contact</p>
          <div className="vertical-input-container">
              <input className="form-input" placeholder={"Email address"} />
              <input className="form-input" placeholder={"Phone Number"}/>
          </div>
        <p className="text-label">Address</p>
        <input className="form-input" placeholder={"Street Address"}></input>
          <p className="text-label">Agency (optional)</p>
          <input className="form-input" placeholder={"Organization/Affiliation"}></input>
      </div>

      <div className={"buttons-container"}>
          <button className={"save-button"}>Save</button>
          <button className={"cancel-button"} onClick={handleProfile}>Cancel</button>
      </div>
    </div>
  );
};

export default EditProfile;
