
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      setStep(2);
      return;
    }
    
    setIsLoading(true);
    
    // Simulate account creation
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to homepage would happen here in a real application
      window.location.href = '/';
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link
            to="/"
            className="inline-block hover:opacity-80 transition-opacity"
          >
            <img
              src="/assets/logo.png"
              alt="Quizory"
              className="h-10 w-auto mx-auto"
            />
          </Link>
          <h1 className="text-2xl font-bold mt-6 mb-2 text-foreground">
            Create an account
          </h1>
          <p className="text-muted-foreground">
            Join QuizVerse to access thousands of quizzes
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            {step === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                    placeholder="Enter your email"
                    required
                  />
                </div>

                <button type="submit" className="w-full btn-primary h-10">
                  Continue
                </button>
              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Create a password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium mb-1 text-foreground"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full px-3 py-2 rounded-md border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
                      placeholder="Confirm your password"
                      required
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start space-x-2 text-sm">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    className="mt-1"
                    required
                  />
                  <label htmlFor="terms" className="text-muted-foreground">
                    I agree to the{' '}
                    <Link
                      to="/terms"
                      className="text-primary hover:underline"
                    >
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link
                      to="/privacy"
                      className="text-primary hover:underline"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary flex justify-center items-center h-10"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <div className="h-5 w-5 border-2 border-t-transparent border-white rounded-full animate-spin"></div>
                  ) : (
                    'Create Account'
                  )}
                </button>

                <button
                  type="button"
                  className="w-full text-sm text-primary hover:underline mt-2"
                  onClick={() => setStep(1)}
                >
                  Back
                </button>
              </form>
            )}

            <div className="mt-6 pt-5 border-t border-border text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
