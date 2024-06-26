import { yupResolver } from "@hookform/resolvers/yup";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuth } from "../../contexts/AuthContext";
import FormError from "./FormError";
import {
  Button,
  Typography,
  Box,
  FormHelperText,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Divider,
} from "@mui/material";
import { registerUserOnServer, getOrganizations } from "../../lib/services";
import type {
  RegisterFormValues,
  Organization,
  UserType,
} from "~/types/AuthTypes";
// Register components
import { RegisterTextField } from "../../components/Auth/RegisterForms/RegisterTextField";
import { RegisterTextFieldPassword } from "../../components/Auth/RegisterForms/RegisterTextFieldPassword";
// import { RegisterTextFieldPhone } from "../../components/Auth/RegisterForms/RegisterTextFieldPhone";
import { feedback } from "../../components/Auth/RegisterForms/RegisterFeedback";
import { USER_TYPE } from "../../lib/constants";

const schema = Yup.object().shape({
  name: Yup.string()
    .matches(/^([A-Za-z]+\s[A-Za-z]+)$/, {
      message: feedback.name,
    })
    .required(feedback.name),
  email: Yup.string().email(feedback.email).required(feedback.email),
  password: Yup.string()
    .matches(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[\W_])(.{8,})$/, feedback.password)
    .required(feedback.password),
  userType: Yup.string().required(feedback.userType),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], feedback.confirmPassword)
    .required(feedback.confirmPassword),
  phone: Yup.string().matches(
    /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/,
  ),
  address: Yup.string(),
  zip: Yup.string().matches(/^\d{5}(-\d{4})?$/),
  city: Yup.string(),
  state: Yup.string(),
  affiliation: Yup.string().when("userType", ([userType], s) => {
    if (userType !== USER_TYPE.PUBLIC && userType !== "") {
      return s.required(feedback.affiliation);
    }
    return s;
  }),
});

const Register: React.FC = () => {
  const [userType, setUserType] = useState<string>("");
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string>("");
  const { registerUser, login, currentUser } = useAuth();
  const navigate = useNavigate();

  //how to handle the logic of failing to register on the database
  useEffect(() => {
    if (currentUser) {
      navigate("/home");
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const organizationQueryType: string | undefined = userType
      .split(" ")[0]
      ?.toLocaleLowerCase();

    const queryOrganizations = async (query: string | undefined) => {
      try {
        const response = await getOrganizations(query);
        if (!response.ok) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const message = await response.json();
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          throw new Error(message.message);
        }
        const organizations = (await response.json()) as Organization[];
        setOrganizations(organizations);
      } catch (err: any) {
        if (err instanceof TypeError) {
          setError("Network error: Failed to get organizations");
        } else {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
          setError(err.message);
        }
      }
    };
    queryOrganizations(organizationQueryType);
  }, [userType]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      setError("");
      await registerUser(
        values.name,
        values.email,
        values.password,
        values.userType,
      );
      const user = {
        password: values.password,
        firstName: values.name.split(" ")[0],
        lastName: values.name.split(" ")[1],
        email: values.email,
        phone: values.phone ? values.phone : "Not Provided",
        address: values.address ? values.address : "Not Provided",
        city: values.city ? values.city : "Not Provided",
        state: values.state ? values.state : "Not Provided",
        zip: values.zip ? parseInt(values.zip, 10) : 0,
        userType: values.userType,
        organizationId: values.affiliation
          ? parseInt(values.affiliation, 10)
          : organizations.find((item) => item.name == "Public")?.id,
      } as UserType;

      const response = await registerUserOnServer(user);
      if (!response.ok || response.status !== 201) {
        throw new Error(
          `Failed to save registered user data to database: ${response.status}`,
        );
      }
      await login(values.email, values.password);
      navigate("/home");
    } catch (err: any) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
      setError(err.message);
    }
  };

  const renderOption = (value: string, label: string) => {
    const isSelected = userType === value;

    return (
      <Box
        key={value}
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
        height="35px"
        width="100%"
        borderRadius="10px"
        marginTop="10px"
        border={`1px solid ${isSelected ? "#1976d2" : "#000"}`}
        fontSize="14px"
        fontStyle="Inter, sans-serif"
        bgcolor={isSelected ? "#6D6D6D" : "transparent"}
        color={isSelected ? "#fff" : "#000"}
        onClick={() => setUserType(value)}
        style={{ cursor: "pointer" }}
      >
        {label}
      </Box>
    );
  };

  return (
    <Box
      mt={10}
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="100%"
      style={{
        fontFamily: "Raleway, sans-serif",
        fontSize: "15px",
        fontWeight: "400",
      }}
    >
      <Typography
        fontWeight="bold"
        component="h2"
        variant="h6"
        style={{
          margin: "1rem 0rem 1rem 0rem",
          color: "var(--mtmNavy)",
          fontSize: "25px",
          fontWeight: "700",
        }}
      >
        Create an account
      </Typography>

      <Box width="75%">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Box>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Name<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2} mb={2}>
              <RegisterTextField
                name="name"
                placeHolder="Name"
                control={control}
                errors={errors.name}
              />
            </Box>
          </Box>
          <Box>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Email <span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2} mb={2}>
              <RegisterTextField
                name="email"
                placeHolder="Email address"
                control={control}
                errors={errors.email}
              />
            </Box>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Phone
            </Typography>
            <Box mt={-2} mb={2}>
              <RegisterTextField
                name="phone"
                placeHolder="Phone number"
                control={control}
                errors={errors.phone}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Password<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            <Box mt={-2}>
              <RegisterTextFieldPassword
                name="password"
                placeHolder="Create a password"
                control={control}
                errors={errors.password}
              />
            </Box>

            <Box mt={-0.5} mb={2}>
              <RegisterTextFieldPassword
                name="confirmPassword"
                placeHolder="Confirm password"
                control={control}
                errors={errors.confirmPassword}
              />
            </Box>
          </Box>

          <Box>
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Address
            </Typography>
            <Box mt={-2} mb={1.5}>
              <RegisterTextField
                name="address"
                placeHolder="Street Address"
                control={control}
                errors={errors.address}
              />
            </Box>
            <Box
              mt={-2.5}
              mb={2}
              display="flex"
              flexDirection="row"
              width="100%"
              gap={4}
            >
              <Box width="100%">
                <RegisterTextField
                  name="city"
                  placeHolder="City"
                  control={control}
                  errors={errors.city}
                />
              </Box>
              <Box width="100%">
                <RegisterTextField
                  name="state"
                  placeHolder="State"
                  control={control}
                  errors={errors.state}
                />
              </Box>
              <Box width="100%">
                <RegisterTextField
                  name="zip"
                  placeHolder="Zip"
                  control={control}
                  errors={errors.zip}
                />
              </Box>
            </Box>
          </Box>

          <Box mb={2} width="100%">
            <Typography
              variant="body1"
              style={{
                fontFamily: "Raleway, sans-serif",
              }}
            >
              Account Type<span style={{ color: "#EF4444" }}>*</span>
            </Typography>
            {/* <Typography
              variant="body1"
              color="var(--mtmNavy)"
              style={{
                fontFamily: "Raleway, sans-serif",
                fontSize: "15px",
                fontWeight: "400",
              }}
            >
              Choose the account type that most aligns with your needs and
              interactions
            </Typography> */}

            <Controller
              name="userType"
              control={control}
              render={({ field: { value, onChange } }) => (
                <FormControl component="fieldset" style={{ width: "100%" }}>
                  <Box
                    style={{
                      width: "100%",
                    }}
                  >
                    <div
                      onClick={() => {
                        onChange(USER_TYPE.PUBLIC);
                        setUserType(USER_TYPE.PUBLIC);
                      }}
                      style={{
                        border: "1px solid #ccc",
                        textAlign: "center",
                        marginTop: "8px",
                        borderRadius: "10px",
                        padding: "8px",
                        backgroundColor:
                          value === USER_TYPE.PUBLIC
                            ? "var(--mtmNavy)"
                            : "transparent",
                        color: value === USER_TYPE.PUBLIC ? "#fff" : "#000",
                        cursor: "pointer",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {USER_TYPE.PUBLIC}
                    </div>
                    <div
                      onClick={() => {
                        onChange(USER_TYPE.AGENCY);
                        setUserType(USER_TYPE.AGENCY);
                      }}
                      style={{
                        marginTop: "8px",
                        textAlign: "center",
                        border: "1px solid #ccc",
                        borderRadius: "10px",
                        padding: "8px",
                        backgroundColor:
                          value === USER_TYPE.AGENCY
                            ? "var(--mtmNavy)"
                            : "transparent",
                        color: value === USER_TYPE.AGENCY ? "#fff" : "#000",
                        cursor: "pointer",
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      {USER_TYPE.AGENCY}
                    </div>
                  </Box>
                  <FormHelperText>
                    {errors.userType ? (
                      <span style={{ color: "#d32f2f" }}>
                        {errors.userType.message}
                      </span>
                    ) : (
                      ""
                    )}
                  </FormHelperText>
                </FormControl>
              )}
            />
          </Box>
          {userType != USER_TYPE.PUBLIC && userType != "" && (
            <Box>
              <Typography variant="body1">
                Affiliation<span style={{ color: "#EF4444" }}>*</span>
              </Typography>
              {/* <Typography
                variant="body1"
                style={{
                  color: "black",
                  fontSize: "15px",
                  fontWeight: "400",
                  fontFamily: "Raleway, sans-serif",
                }}
              >
                Organizational Affiliation (optional)
              </Typography> */}

              <Controller
                name="affiliation"
                control={control}
                render={({ field: { value, onChange } }) => (
                  <FormControl fullWidth variant="standard">
                    <InputLabel
                      id="select-label"
                      style={{
                        color: "var(--mtmLightGray)",
                        fontStyle: "italic",
                        fontSize: "15px",
                        fontFamily: "Raleway, sans-serif",
                      }}
                    >
                      Corporate donor/agency partner
                    </InputLabel>

                    <Select
                      value={value ?? ""}
                      labelId="select-label"
                      label={"Corporate donor/agency partner"}
                      onChange={onChange}
                      style={{
                        border: "none",
                        borderRadius: "100px",
                        color: "black",
                      }}
                      error={!!errors.affiliation}
                    >
                      {organizations.map((organization, index) => (
                        <MenuItem value={organization.id} key={index}>
                          {organization.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors.affiliation ? (
                        <span style={{ color: "#d32f2f" }}>
                          {errors.affiliation.message}
                        </span>
                      ) : (
                        ""
                      )}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </Box>
          )}

          {error && <FormError>{error}</FormError>}

          <Box
            mt={2}
            display="flex"
            flexDirection="column"
            width="100%"
            alignItems="center"
          >
            <Button
              type="submit"
              style={{
                width: "210px",
                height: "43px",
                fontSize: "20px",
                fontWeight: "400",
                fontFamily: "Raleway, sans-serif",
                textTransform: "none",
                backgroundColor: "var(--mtmNavy)",
                color: "white",
                boxShadow: "none",
              }}
            >
              {isSubmitting ? "Signing in" : "Sign up"}
            </Button>
          </Box>
        </form>

        <Box mt={2}>
          <Typography style={{ textAlign: "center" }}>
            <Link
              to="/"
              style={{
                color: "gray",
                textDecoration: "none",
                fontFamily: "Raleway, sans-serif",
              }}
            >
              <span
                style={{
                  fontWeight: "normal",
                }}
              >
                Already have an account?
              </span>
              <span style={{ fontWeight: "bold" }}> Log in</span>
            </Link>
          </Typography>
        </Box>

        <Divider style={{ width: "100%", marginTop: 20 }} />

        <Typography style={{ margin: 10, textAlign: "center", opacity: 0.7 }}>
          By signing up, you hereby agree to allow us to use your email address
          to send occasional updates and donation invites. We guarantee the
          confidentiality of your personal information and ensure it will not be
          shared with any third parties.
        </Typography>
      </Box>
    </Box>
  );
};

export default Register;
