// src/components/IngestaArchivos/Stepper.tsx
export default function Stepper({ currentStep }: { currentStep: number }) {
    const steps = ['Confirmación', 'Estructura', 'Validación'];
    return (
        <div className="flex items-center justify-center space-x-4">
            {steps.map((label, index) => {
                const stepNumber = index + 1;
                const isActive = stepNumber === currentStep;
                const isCompleted = stepNumber < currentStep;
                return (
                    <div key={label} className="flex items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${isCompleted ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-gray-300'}`}>
                            {stepNumber}
                        </div>
                        <span className={`ml-2 text-sm ${isActive ? 'font-bold text-orange-500' : 'text-gray-500'}`}>{label}</span>
                        {stepNumber < steps.length && <div className="w-16 h-0.5 bg-gray-200 mx-4"></div>}
                    </div>
                );
            })}
        </div>
    );
}