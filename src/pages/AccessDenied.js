import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from 'primereact/card';
import { Message } from 'primereact/message';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';

function AccessDenied() {
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/', { replace: true });
    }, 7000);

    return () => clearTimeout(timeout);
  }, [navigate]);

  return (
    <div className="flex align-items-center justify-content-center h-screen p-6 surface-ground">
      <Card
        title={
          <div className="flex align-items-center justify-content-center gap-3">
            <i className="pi pi-lock" style={{ fontSize: '2.5rem', color: '#d13636' }}></i>
            <span className="text-3xl font-bold text-red-600">Acces Interzis</span>
          </div>
        }
        className="w-full max-w-32rem text-center surface-card shadow-4 border-round-lg"
        style={{ animation: 'slideFadeIn 0.7s ease forwards' }}
      >
        <Message
          severity="error"
          text="Nu ai permisiunea necesară pentru a accesa această pagină."
          className="mb-6 text-lg"
          style={{ fontWeight: 600 }}
        />
        <p className="mb-6 text-md text-600">Vei fi redirecționat automat în câteva secunde...</p>
        <Button
          label="Înapoi la pagina principală"
          icon="pi pi-arrow-left"
          className="p-button-rounded p-button-lg p-button-outlined p-button-danger"
          onClick={() => navigate('/')}
          style={{ width: '100%', color:'white' }}
        >
          <Ripple />
        </Button>
      </Card>

      <style>{`
        @keyframes slideFadeIn {
          0% {
            opacity: 0;
            transform: translateY(-20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .p-button-danger {
          border-color: #d13636;
          color: #d13636;
        }

        .p-button-danger:hover,
        .p-button-danger:focus {
          background-color: #d13636;
          color: white;
          border-color: #a92f2f;
        }
      `}</style>
    </div>
  );
}

export default AccessDenied;
