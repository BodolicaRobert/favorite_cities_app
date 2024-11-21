import { useState } from "react";
import { Box, Text, Input, Button, Fieldset, Stack } from "@chakra-ui/react";
import { useRouter } from "next/router";

export default function Register() {
  const [formData, setFormData] = useState({ email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors = {};

    // Email validation
    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!/(?=.*[!@#$%^&*])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = "Password must contain at least one special character and one digit.";
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        alert("Registration successful!");
        router.push("/"); // Redirect to the homepage
      } else {
        alert(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      alert("An error occurred during registration.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box p={5} maxW="400px" mx="auto" mt="10" boxShadow="lg" borderRadius="md" bg="gray.800">
      <Text fontSize="2xl" fontWeight="bold" color="white" mb={4}>
        Register
      </Text>
      <form onSubmit={handleSubmit}>
        <Fieldset.Root size="lg" mb={4} invalid={!!errors.email}>
          <Stack>
            <Fieldset.Legend>Email</Fieldset.Legend>
            <Input
              type="email"
              placeholder="Email"
              bg="gray.600" // Background color for more visibility             
              _focus={{
                borderColor: "teal.400",
                boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.6)", // Slight box shadow on focus
              }}             
              pl={2}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </Stack>
          {errors.email && <Fieldset.ErrorText>{errors.email}</Fieldset.ErrorText>}
        </Fieldset.Root>

        <Fieldset.Root size="lg" mb={4} invalid={!!errors.password}>
          <Stack>
            <Fieldset.Legend>Password</Fieldset.Legend>
            <Input
              type="password"
              placeholder="Password"             
              bg="gray.600" // Background color for more visibility             
              _focus={{
                borderColor: "teal.400",
                boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.6)", // Slight box shadow on focus
              }}
              mb={1}
              pl={2}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </Stack>
          {errors.password && <Fieldset.ErrorText>{errors.password}</Fieldset.ErrorText>}
        </Fieldset.Root>

        <Fieldset.Root size="lg" mb={4} invalid={!!errors.confirmPassword}>
          <Stack>
            <Fieldset.Legend>Confirm Password</Fieldset.Legend>
            <Input
              type="password"
              placeholder="Confirm Password"
              bg="gray.600" // Background color for more visibility             
              _focus={{
                borderColor: "teal.400",
                boxShadow: "0 0 0 2px rgba(236, 72, 153, 0.6)", // Slight box shadow on focus
              }}
              mb={1}
              pl={2}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </Stack>
          {errors.confirmPassword && <Fieldset.ErrorText>{errors.confirmPassword}</Fieldset.ErrorText>}
        </Fieldset.Root>

        <Button
          type="submit"
          isLoading={isSubmitting}
          colorScheme="teal"
          width="full"
          mt={4}
        >
          Register
        </Button>
      </form>
    </Box>
  );
}
