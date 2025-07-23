'use client';
import { MyBookings } from '@/components/my-bookings';
import { useAuth } from '@/components/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MeusAgendamentosPage() {
    const { user, loading } = useAuth();
    const router = useRouter();
  
    useEffect(() => {
      if (!loading && !user) {
        router.push('/login');
      }
    }, [user, loading, router]);

    if (loading || !user) {
        return null;
    }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-center md:text-left">
        Meus Agendamentos
      </h1>
      <p className="text-muted-foreground mb-8 text-center md:text-left">
        Veja e gerencie seus horários agendados.
      </p>
      <MyBookings />
    </div>
  );
}
