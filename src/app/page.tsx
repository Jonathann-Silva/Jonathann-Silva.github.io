'use client';
import { BookingForm } from '@/components/booking-form';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login');
      } else if (isAdmin) {
        router.push('/admin/dashboard');
      }
    }
  }, [user, loading, isAdmin, router]);
  
  if (loading || !user || isAdmin) {
    return null; 
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-center md:text-left">
        Agendar Horário
      </h1>
      <p className="text-muted-foreground mb-8 text-center md:text-left">
        Escolha o serviço, barbeiro e a data para ver os horários disponíveis.
      </p>
      <BookingForm />
    </div>
  );
}
