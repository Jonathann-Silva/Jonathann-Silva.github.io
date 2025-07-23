'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Scissors, User, Repeat, X } from 'lucide-react';
import Image from 'next/image';

const upcomingBookings = [
  {
    id: 1,
    date: '25 de Julho, 2024',
    time: '14:30',
    service: 'Cabelo e Barba',
    barber: 'Torelli',
    image: 'https://placehold.co/100x100',
    imageHint: 'barber portrait',
  },
];

const pastBookings = [
  {
    id: 2,
    date: '10 de Junho, 2024',
    time: '11:00',
    service: 'Corte de Cabelo',
    barber: 'Anchar',
    image: 'https://placehold.co/100x100',
    imageHint: 'barbershop interior',
  },
  {
    id: 3,
    date: '15 de Maio, 2024',
    time: '16:00',
    service: 'Barba',
    barber: 'Torelli',
    image: 'https://placehold.co/100x100',
    imageHint: 'shaving cream',
  },
];

export function MyBookings() {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="font-headline text-3xl mb-6">Próximos Agendamentos</h2>
        {upcomingBookings.length > 0 ? (
          <div className="grid gap-6">
            {upcomingBookings.map((booking) => (
              <Card key={booking.id} className="overflow-hidden shadow-lg border-2 border-primary/20">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/4 relative">
                    <Image
                      src={booking.image}
                      alt={`Foto do barbeiro ${booking.barber}`}
                      width={200}
                      height={200}
                      data-ai-hint={booking.imageHint}
                      className="object-cover w-full h-48 md:h-full"
                    />
                  </div>
                  <div className="flex-1">
                    <CardHeader>
                      <CardTitle className="font-headline text-2xl">{booking.service}</CardTitle>
                      <CardDescription className="flex items-center gap-4 pt-2">
                        <Badge variant="secondary" className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {booking.date}</Badge>
                        <Badge variant="secondary" className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> {booking.time}</Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                       <div className="flex items-center text-sm text-muted-foreground">
                        <User className="w-4 h-4 mr-2" />
                        Barbeiro: <span className="font-semibold ml-1 text-foreground">{booking.barber}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-2">
                        <Button variant="outline"><X className="mr-2 h-4 w-4"/> Cancelar</Button>
                        <Button><Repeat className="mr-2 h-4 w-4"/> Remarcar</Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Você não tem agendamentos futuros.</p>
        )}
      </div>

      <div>
        <h2 className="font-headline text-3xl mb-6">Agendamentos Passados</h2>
        {pastBookings.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastBookings.map((booking) => (
              <Card key={booking.id} className="flex flex-col justify-between shadow-md hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="font-headline text-xl flex items-center gap-2">
                    <Scissors className="w-5 h-5 text-primary" /> {booking.service}
                  </CardTitle>
                  <CardDescription>
                    com {booking.barber}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 mr-2" />
                    {booking.date} às {booking.time}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="secondary" className="w-full">
                    <Repeat className="mr-2 h-4 w-4"/>
                    Agendar Novamente
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">Nenhum histórico de agendamentos encontrado.</p>
        )}
      </div>
    </div>
  );
}
