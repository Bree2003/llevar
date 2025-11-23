// src/components/IngestaArchivos/Stepper.tsx
interface StepperProps {
  currentStep: number;
  isNuevo: boolean;
}
export default function Stepper({ currentStep, isNuevo }: StepperProps) {
  const stepsExistente = ["Confirmación", "Estructura", "Validación"];
  const stepsNuevo = ["Confirmación", "Estructura"];

  const steps = isNuevo ? stepsNuevo : stepsExistente;
  return (
    <div className="flex items-center justify-center space-x-4">
      {steps.map((label, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = stepNumber < currentStep;
        return (
          <div key={label} className="flex items-center">
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center text-white ${
                isCompleted
                  ? "bg-[--color-naranjo]"
                  : isActive
                  ? "bg-[--color-naranjo]"
                  : "bg-gray-300"
              }`}
            >
              {stepNumber}
            </div>
            {stepNumber < steps.length && (
              <div className="w-8 h-0.5 bg-[--color-gris-oscuro] mx-4"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
