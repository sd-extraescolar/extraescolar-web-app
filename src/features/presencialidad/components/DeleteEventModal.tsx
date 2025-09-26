import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertTriangle, X } from "lucide-react";
import { useState } from "react";

interface DeleteEventModalProps {
  selectedDate: Date;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteEventModal = ({ selectedDate, onConfirm, onCancel }: DeleteEventModalProps) => {
  const [isChecked, setIsChecked] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).format(date);
  };

  const isDeleteEnabled = isChecked && confirmationText === 'borrar evento';

  const handleCheckboxChange = (checked: boolean) => {
    setIsChecked(checked);
    if (!checked) {
      // Limpiar el texto de confirmación cuando se desmarca el checkbox
      setConfirmationText('');
    }
  };

  const handleConfirm = () => {
    if (isDeleteEnabled) {
      onConfirm();
      onCancel(); // Cerrar el modal después de confirmar
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md mx-4 bg-white border-0 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-50">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <CardTitle className="text-lg font-semibold text-dark-text">
                  Eliminar Evento
                </CardTitle>
                <CardDescription className="text-sm text-medium-gray">
                  Esta acción no se puede deshacer
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCancel}
              className="p-2 hover:bg-light-gray rounded-lg"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Warning Message */}
          <div className="p-4 rounded-lg bg-red-50 border border-red-200">
            <p className="text-sm text-red-800">
              <strong>Advertencia:</strong> Estás a punto de eliminar permanentemente el evento de asistencia para el <strong>{formatDate(selectedDate)}</strong>. 
              Todos los datos de presencialidad registrados para esta fecha se perderán y no podrán recuperarse.
            </p>
          </div>

          {/* Confirmation Checkbox */}
          <div className="flex items-start gap-3">
            <Checkbox
              id="confirm-delete"
              checked={isChecked}
              onCheckedChange={(checked) => handleCheckboxChange(checked === true)}
              className="mt-1"
            />
            <label 
              htmlFor="confirm-delete" 
              className="text-sm text-dark-text cursor-pointer"
            >
              Entiendo que esta acción eliminará permanentemente el evento y todos sus datos asociados.
            </label>
          </div>

          {/* Confirmation Text Input */}
          <div className="space-y-2">
            <label htmlFor="confirmation-text" className="text-sm font-medium text-dark-text">
              Para confirmar, escribe <strong>"borrar evento"</strong> en el campo de abajo:
            </label>
            <Input
              id="confirmation-text"
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="borrar evento"
              disabled={!isChecked}
              className={`w-full ${!isChecked ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-dark-text border-gray-300'}`}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!isDeleteEnabled}
              className="flex-1 bg-red-500 text-white border-red-500 hover:bg-red-600 hover:border-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Eliminar Evento
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
