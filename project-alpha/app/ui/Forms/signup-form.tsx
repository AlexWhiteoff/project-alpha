"use client";

import { FormEvent, useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
import { Button } from "@/app/ui/button";
import { signUp } from "@/app/lib/actions/auth";
import { ChevronLeftIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { useRouter } from "next/navigation";
import styles from "@/app/ui/form.module.css";

const genders = [
    {
        name: "Male",
        value: "male",
    },
    {
        name: "Female",
        value: "female",
    },
    {
        name: "Non-binary",
        value: "non_binary",
    },
    {
        name: "Something else",
        value: "something_else",
    },
    {
        name: "Prefer not to say",
        value: "prefer_not_to_say",
    },
    {
        name: "Other",
        value: "other",
    },
];

const months = [
    { name: "January", value: 1 },
    { name: "February", value: 2 },
    { name: "March", value: 3 },
    { name: "April", value: 4 },
    { name: "May", value: 5 },
    { name: "June", value: 6 },
    { name: "July", value: 7 },
    { name: "August", value: 8 },
    { name: "September", value: 9 },
    { name: "October", value: 10 },
    { name: "November", value: 11 },
    { name: "December", value: 12 },
];

const PasswordBlock = ({
    NextStep,
    errors,
    value,
    setValue,
}: {
    NextStep: () => void;
    errors: string[] | undefined;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const password = value;
    const [isPasswordValid, setIsPasswordValid] = useState({
        length: false,
        letter: false,
        numberOrSpecialChar: false,
    });
    const [isButtonClicked, setIsButtonClicked] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    useEffect(() => {
        const hasLength = password.length >= 8;
        const hasLetter = /[a-zA-Z]/.test(password);
        const hasNumberOrSpecialChar = /[^a-zA-Z\s]/.test(password);

        setIsPasswordValid({
            length: hasLength,
            letter: hasLetter,
            numberOrSpecialChar: hasNumberOrSpecialChar,
        });
    }, [password]);

    const isFormValid = isPasswordValid.length && isPasswordValid.letter && isPasswordValid.numberOrSpecialChar;

    const handleButtonClick = () => {
        setIsButtonClicked(true);

        if (isFormValid) {
            NextStep();
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible((prevState) => !prevState);
    };

    return (
        <div>
            <div className="my-4">
                <label className="block text-sm font-medium text-grey-800" htmlFor="password">
                    Password
                </label>
                <div className="flex flex-col justify-center items-end mt-1">
                    <input
                        className="focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 pl-2 pr-10 py-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type={isPasswordVisible ? "text" : "password"}
                        name="password"
                        id="password"
                        autoComplete="new-password"
                        required
                        onChange={(e) => setValue(e.target.value)}
                        value={password || ""}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="relative mr-2 bottom-8 text-gray-500 hover:text-gray-800"
                    >
                        {isPasswordVisible ? <EyeIcon className="w-6" /> : <EyeSlashIcon className="w-6" />}
                    </button>
                </div>
            </div>
            <div className="text-sm">
                <span className="font-bold">Your password must contain at least:</span>
                <ul className={styles.formList + " ml-5"}>
                    <li
                        className={clsx({
                            "text-red-500 before:!border-red-500": !isPasswordValid.length && isButtonClicked,
                            "text-green-500 before:!border-green-500": isPasswordValid.length,
                        })}
                    >
                        8 characters
                    </li>
                    <li
                        className={clsx({
                            "text-red-500 before:!border-red-500": !isPasswordValid.letter && isButtonClicked,
                            "text-green-500 before:!border-green-500": isPasswordValid.letter,
                        })}
                    >
                        1 letter
                    </li>
                    <li
                        className={clsx({
                            "text-red-500 before:!border-red-500":
                                !isPasswordValid.numberOrSpecialChar && isButtonClicked,
                            "text-green-500 before:!border-green-500": isPasswordValid.numberOrSpecialChar,
                        })}
                    >
                        1 number or special character
                    </li>
                </ul>
            </div>
            <Button type="button" onClick={() => handleButtonClick()} className="w-full mt-8 text-center">
                Next Step
            </Button>
        </div>
    );
};

const EmailBlock = ({
    NextStep,
    errors,
    value,
    setValue,
}: {
    NextStep: () => void;
    errors: string[] | undefined;
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
}) => {
    const email = value;
    const [emailError, setEmailError] = useState({ status: false, message: "" });
    const [isFormValid, setIsFormValid] = useState(false);

    const validateEmail = (email: string) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    };

    const handleButtonClick = () => {
        if (email.length === 0) {
            setEmailError({ status: true, message: "Please enter a valid email address." });
            return 0;
        }

        if (validateEmail(email)) {
            setIsFormValid(true);
            NextStep();
        } else {
            setIsFormValid(false);
            setEmailError({
                status: true,
                message: "This email is invalid. Make sure it's written like example@email.com.",
            });
        }
    };

    return (
        <div>
            <div className="my-4">
                <h1 className="mb-8 text-4xl font-bold">Sign up to start listening</h1>
                <div className="my-4">
                    <label className="block text-sm font-medium text-grey-800" htmlFor="email">
                        Email address
                    </label>
                    <input
                        className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="email"
                        name="email"
                        id="email"
                        autoComplete="email"
                        placeholder="name@domain.com"
                        required
                        onChange={(e) => setValue(e.target.value)}
                        value={email || ""}
                    />
                </div>
            </div>
            {emailError.status || errors ? (
                <div className="text-sm">
                    <span className="text-red-500">{emailError.message || errors}</span>
                </div>
            ) : null}
            <Button type="button" onClick={() => handleButtonClick()} className="w-full mt-8 text-center">
                Next Step
            </Button>
        </div>
    );
};

const PersonalInfoBlock = ({
    NextStep,
    errors,
    fields,
}: {
    NextStep: () => void;
    errors?: { [key: string]: string[] };
    fields: {
        username: {
            value: string;
            setValue: React.Dispatch<React.SetStateAction<string>>;
        };
        birthday: {
            value: {
                day: number;
                month: number;
                year: number;
            };
            setValue: React.Dispatch<
                React.SetStateAction<{
                    day: number;
                    month: number;
                    year: number;
                }>
            >;
        };
        gender: {
            value: string;
            setValue: React.Dispatch<React.SetStateAction<string>>;
        };
    };
}) => {
    const username = fields.username.value;
    const birthday = fields.birthday.value;
    const gender = fields.gender.value;
    const [infoError, setInfoError] = useState({
        username: "",
        birthday: {
            day: "",
            month: "",
            year: "",
        },
        gender: "",
    });
    const [isFormValid, setIsFormValid] = useState(false);

    const validateUsername = (username: string) => {
        return username.length >= 2;
    };

    const validateBirthdayDay = (day: number) => {
        return day > 0 && day < 32;
    };

    const validateBirthdayMonth = (month: number) => {
        return month > 0 && month < 13;
    };

    const validateGender = (gender: string) => {
        return genders.some((obj) => obj.value === gender);
    };

    const handleButtonClick = () => {
        let formIsValid = true;

        if (!username) {
            setInfoError((prev) => ({ ...prev, username: "Please enter your name." }));
            formIsValid = false;
        } else if (!validateUsername(username)) {
            setInfoError((prev) => ({ ...prev, username: "Your name must be at least 2 characters." }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, username: "" }));
        }

        if (!birthday.day || !birthday.month || !birthday.year) {
            setInfoError((prev) => ({
                ...prev,
                birthday: { ...prev.birthday, message: "Please enter your date of birth." },
            }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, birthday: { ...prev.birthday, message: "" } }));
        }

        if (!validateBirthdayDay(birthday.day)) {
            setInfoError((prev) => ({
                ...prev,
                birthday: {
                    ...prev.birthday,
                    day: "Please enter the day of your birth date as a number between 1 and 31.",
                },
            }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, birthday: { ...prev.birthday, day: "" } }));
        }

        if (!validateBirthdayMonth(birthday.month)) {
            setInfoError((prev) => ({ ...prev, birthday: { ...prev.birthday, month: "Select your birth month." } }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, birthday: { ...prev.birthday, month: "" } }));
        }

        if (birthday.year < 1900) {
            setInfoError((prev) => ({
                ...prev,
                birthday: {
                    ...prev.birthday,
                    year: "Please enter the year of your birth date using four digits (e.g., 1990).",
                },
            }));
            formIsValid = false;
        } else if (birthday.year > new Date().getFullYear() - 16) {
            setInfoError((prev) => ({
                ...prev,
                birthday: { ...prev.birthday, year: "You’re too young to create an account." },
            }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, birthday: { ...prev.birthday, year: "" } }));
        }

        if (!gender) {
            setInfoError((prev) => ({ ...prev, gender: "Please select your gender." }));
            formIsValid = false;
        } else if (!validateGender(gender)) {
            setInfoError((prev) => ({ ...prev, gender: "Please select a valid gender." }));
            formIsValid = false;
        } else {
            setInfoError((prev) => ({ ...prev, gender: "" }));
        }

        setIsFormValid(formIsValid);

        if (formIsValid) {
            NextStep();
        }
    };

    return (
        <div>
            <div className="my-4">
                <label className="block text-sm font-medium text-grey-800" htmlFor="username">
                    Name
                </label>
                <input
                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    type="text"
                    name="username"
                    id="username"
                    autoComplete="username"
                    onChange={(e) => fields.username.setValue(e.target.value)}
                    value={username || ""}
                    required
                />
            </div>
            {errors?.username &&
                errors.username.map((error) => (
                    <div key={error} className="text-sm text-red-500">
                        {error}
                    </div>
                ))}
            {infoError.username && <div className="text-sm text-red-500">{infoError.username}</div>}
            <div className="my-4">
                <div className="block text-sm font-medium text-grey-800">Date of birth</div>
                <div className="flex gap-2 w-full">
                    <input
                        className="mt-1 w-[50px] focus:ring-indigo-500 focus:border-indigo-500 block h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="number"
                        name="birthday_day"
                        id="birthday_day"
                        max={31}
                        min={1}
                        maxLength={2}
                        placeholder="dd"
                        onChange={(e) => fields.birthday.setValue({ ...birthday, day: parseInt(e.target.value) })}
                        value={birthday.day || ""}
                        required
                    />
                    <select
                        className="mt-1 w-full focus:ring-indigo-500 focus:border-indigo-500 block h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        name="birthday_month"
                        id="birthday_month"
                        required
                        defaultValue={birthday.month || 0}
                        onChange={(e) => fields.birthday.setValue({ ...birthday, month: parseInt(e.target.value) })}
                    >
                        <option value={0} disabled>
                            Month
                        </option>
                        {months.map((month) => (
                            <option key={month.value} value={month.value}>
                                {month.name}
                            </option>
                        ))}
                    </select>
                    <input
                        className="mt-1 w-[70px] focus:ring-indigo-500 focus:border-indigo-500 block h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                        type="number"
                        name="birthday_year"
                        id="birthday_year"
                        min={1900}
                        max={new Date().getFullYear()}
                        maxLength={4}
                        placeholder="yyyy"
                        onChange={(e) => fields.birthday.setValue({ ...birthday, year: parseInt(e.target.value) })}
                        required
                        value={birthday.year || ""}
                    />
                </div>
            </div>
            {errors?.birthday_day &&
                errors.birthday_day.map((error) => (
                    <div key={error} className="text-sm text-red-500">
                        {error}
                    </div>
                ))}
            {infoError.birthday.day && <div className="text-sm text-red-500">{infoError.birthday.day}</div>}
            {infoError.birthday.month && <div className="text-sm text-red-500">{infoError.birthday.month}</div>}
            {infoError.birthday.year && <div className="text-sm text-red-500">{infoError.birthday.year}</div>}
            <div className="my-4">
                <div className="block text-sm font-medium text-grey-800">Gender</div>
                <select
                    className="mt-1 w-full focus:ring-indigo-500 focus:border-indigo-500 block h-10 px-2 shadow-sm sm:text-sm border-gray-300 rounded-md"
                    name="gender"
                    id="gender"
                    required
                    defaultValue={gender || 0}
                    onChange={(e) => fields.gender.setValue(e.target.value)}
                >
                    <option value={0} disabled>
                        Gender
                    </option>
                    {genders.map((gender) => (
                        <option key={gender.value} value={gender.value}>
                            {gender.name}
                        </option>
                    ))}
                </select>
            </div>
            {errors?.gender &&
                errors.gender.map((error) => (
                    <div key={error} className="text-sm text-red-500">
                        {error}
                    </div>
                ))}
            {infoError.gender && <div className="text-sm text-red-500">{infoError.gender}</div>}
            <Button type="button" onClick={handleButtonClick} className="w-full mt-8 text-center">
                Next Step
            </Button>
        </div>
    );
};

const AgreeAcknowledgeBlock = () => {
    const [checkedItems, setCheckedItems] = useState({
        termsAndConditions: false,
        spamEmails: false,
    });

    const handleCheckboxChange = (name: string, checked: boolean) => {
        setCheckedItems({ ...checkedItems, [name]: checked });
    };

    return (
        <div>
            <div className="my-4">
                <label className="flex gap-4 justify-start items-center">
                    <input
                        type="checkbox"
                        name="termsAndConditions"
                        checked={checkedItems.termsAndConditions || false}
                        onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm border-gray-300 rounded-md"
                        required
                    />
                    <span className="block text-sm font-medium text-grey-800">
                        I agree to the Terms and Conditions of Use and Privacy Policy.
                    </span>
                </label>
                <br />
                <label className="flex gap-4 justify-start items-center">
                    <input
                        type="checkbox"
                        name="spamEmails"
                        checked={checkedItems.spamEmails || false}
                        onChange={(e) => handleCheckboxChange(e.target.name, e.target.checked)}
                        className="focus:ring-indigo-500 focus:border-indigo-500 block shadow-sm border-gray-300 rounded-md"
                    />
                    <span className="block text-sm font-medium text-grey-800">
                        I would prefer not to receive marketing messages from Project Alpha.
                    </span>
                </label>
            </div>
        </div>
    );
};

export default function SignupForm() {
    const [step, setStep] = useState<number>(0);
    const [state, dispatch] = useFormState(signUp, undefined);
    const steps = ["Create a password", "Tell about yourself", "Agreements and Acknowledgments"];
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [birthday, setBirthday] = useState({
        day: 0,
        month: 0,
        year: 0,
    });
    const [gender, setGender] = useState("");

    const NextStep = () => {
        setStep(step + 1);
    };
    const PrevStep = () => {
        setStep(step - 1);
    };

    useEffect(() => {
        router.replace(`/signup#step=${step}`);
    }, [step, router]);

    const handleSubmit = (formData: FormData) => {
        if (!email || !password || !username || !birthday.day || !birthday.month || !birthday.year || !gender) {
            return;
        }

        formData.append("email", email);
        formData.append("password", password);
        formData.append("username", username);
        formData.append("birthday_day", birthday.day.toString());
        formData.append("birthday_month", birthday.month.toString());
        formData.append("birthday_year", birthday.year.toString());
        formData.append("gender", gender);

        dispatch(formData);
    };

    return (
        <form action={(e) => handleSubmit(e)} className="space-y-3">
            <div className="px-6 pb-4 pt-16">
                {step > 0 && (
                    <div className="mx-auto">
                        <div className="md:w-[520px] bg-[#2d2827] h-1 rounded mb-8">
                            <div
                                className={clsx(" transition-all relative bg-[#3B82F6] h-1 rounded mb-4", {
                                    "w-[0%]": step === 0,
                                    "w-[33.3%]": step === 1,
                                    "w-[66.6%]": step === 2,
                                    "w-[100%]": step === 3,
                                })}
                            ></div>
                        </div>
                        <div className="flex gap-3 mb-12 align-center">
                            <div className="flex justify-center">
                                <button type="button" onClick={() => PrevStep()}>
                                    <ChevronLeftIcon className="w-12 text-gray-400" />
                                </button>
                            </div>
                            <div className="flex md:w-[400px] gap-2 flex-col">
                                <span className="text-gray-400">Step {step} of 3</span>
                                <h2>{steps[step - 1]}</h2>
                            </div>
                        </div>
                    </div>
                )}
                <div className="mx-auto md:w-[400px]">
                    {step === 0 && (
                        <EmailBlock
                            NextStep={() => NextStep()}
                            errors={state?.errors?.email}
                            value={email}
                            setValue={setEmail}
                        />
                    )}
                    {step === 1 && (
                        <PasswordBlock
                            NextStep={() => NextStep()}
                            errors={state?.errors?.password}
                            value={password}
                            setValue={setPassword}
                        />
                    )}
                    {step === 2 && (
                        <PersonalInfoBlock
                            NextStep={() => NextStep()}
                            errors={state?.errors}
                            fields={{
                                username: {
                                    value: username,
                                    setValue: setUsername,
                                },
                                birthday: {
                                    value: birthday,
                                    setValue: setBirthday,
                                },
                                gender: {
                                    value: gender,
                                    setValue: setGender,
                                },
                            }}
                        />
                    )}
                    {step === 3 && (
                        <>
                            <AgreeAcknowledgeBlock />
                            <div className="my-8">
                                <SignupButton />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </form>
    );
}

function SignupButton() {
    const { pending } = useFormStatus();

    return (
        <Button className="mt-4 w-full" aria-disabled={pending}>
            {pending ? "Submitting..." : "Sign up"}
        </Button>
    );
}
