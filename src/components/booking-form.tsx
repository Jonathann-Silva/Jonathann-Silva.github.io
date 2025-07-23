
'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  CalendarIcon,
  Clock,
  Loader2,
  Sparkles,
  Star,
  Scissors,
  User,
  CalendarDays,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import {
  suggestAppointmentTimes,
  SuggestAppointmentTimesOutput,
} from '@/ai/flows/suggest-appointment-times';
import { Separator } from './ui/separator';

const barbers = [
  { id: 'torelli', name: 'Torelli' },
  { id: 'anchar', name: 'Anchar' },
];

const services = [
  { id: 'haircut', name: 'Corte de Cabelo' },
  { id: 'shave', name: 'Barba' },
  { id: 'both', name: 'Cabelo e Barba' },
];

const allTimes = Array.from({ length: 18 }, (_, i) => {
  const hour = 9 + Math.floor(i / 2);
  const minute = i % 2 === 0 ? '00' : '30';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
});

const FormSchema = z.object({
  serviceType: z.string({ required_error: 'Por favor, selecione um serviço.' }),
  barberId: z.string({ required_error: 'Por favor, selecione um barbeiro.' }),
  preferredDay: z.date({
    required_error: 'Por favor, selecione uma data.',
  }),
});

export function BookingForm() {
  const { toast } = useToast();
  const [suggestedTimes, setSuggestedTimes] =
    React.useState<SuggestAppointmentTimesOutput | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState<string | null>(null);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const selectedDate = form.watch('preferredDay');
  const selectedBarber = form.watch('barberId');
  const selectedService = form.watch('serviceType');

  React.useEffect(() => {
    async function getSuggestions() {
      if (selectedDate && selectedBarber && selectedService) {
        setLoadingSuggestions(true);
        setSuggestedTimes(null);
        setSelectedTime(null);
        try {
          const serviceName =
            services.find((s) => s.id === selectedService)?.name ||
            selectedService;
          const barberName =
            barbers.find((b) => b.id === selectedBarber)?.name || selectedBarber;

          const result = await suggestAppointmentTimes({
            barberId: barberName,
            serviceType: serviceName,
            preferredDay: format(selectedDate, 'yyyy-MM-dd'),
          });
          setSuggestedTimes(result);
        } catch (error: any) {
          console.error('Error fetching suggestions:', error);
          let description = 'Não foi possível buscar as sugestões de horários. Tente novamente mais tarde.';
          if (error.message && error.message.includes('503')) {
            description = 'O serviço de sugestões está sobrecarregado. Por favor, tente novamente em alguns instantes.';
          }
          toast({
            variant: 'destructive',
            title: 'Erro ao buscar sugestões',
            description: description,
          });
        } finally {
          setLoadingSuggestions(false);
        }
      }
    }
    getSuggestions();
  }, [selectedDate, selectedBarber, selectedService, toast]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!selectedTime) {
      toast({
        variant: 'destructive',
        title: 'Horário não selecionado',
        description: 'Por favor, escolha um horário para agendar.',
      });
      return;
    }
    toast({
      title: 'Agendamento Realizado!',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-background p-4">
          <code className="text-foreground">
            {JSON.stringify({ ...data, time: selectedTime }, null, 2)}
          </code>
        </pre>
      ),
    });
  }

  const availableTimes = allTimes.filter(
    (time) => !suggestedTimes?.suggestedTimes.some((st) => st.time === time)
  );

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-lg border-2 border-primary/10">
      <CardContent className="p-6 md:p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid md:grid-cols-3 gap-8">
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 opacity-70" />
                      Serviço
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o serviço" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {services.map((service) => (
                          <SelectItem key={service.id} value={service.id}>
                            {service.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="barberId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <User className="h-4 w-4 opacity-70" />
                      Barbeiro
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o barbeiro" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {barbers.map((barber) => (
                          <SelectItem key={barber.id} value={barber.id}>
                            {barber.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="preferredDay"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 opacity-70" />
                      Data
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full justify-start text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, 'PPP', { locale: ptBR })
                            ) : (
                              <span>Escolha uma data</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          locale={ptBR}
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date <
                            new Date(new Date().setDate(new Date().getDate() - 1))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {selectedDate && selectedBarber && selectedService && (
              <Card className="bg-background/50">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl flex items-center gap-2">
                    <Clock className="w-6 h-6" />
                    Horários Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {loadingSuggestions ? (
                    <div className="flex items-center justify-center h-40">
                      <Loader2 className="mr-2 h-8 w-8 animate-spin text-primary" />
                      <span className="text-muted-foreground">
                        Buscando horários...
                      </span>
                    </div>
                  ) : (
                    <>
                      {suggestedTimes &&
                        suggestedTimes.suggestedTimes.length > 0 && (
                          <div className="space-y-4">
                            <h3 className="text-lg font-semibold flex items-center gap-2 text-accent">
                              <Sparkles className="w-5 h-5" />
                              Horários Recomendados
                            </h3>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                              {suggestedTimes.suggestedTimes.map(
                                (suggestion) => (
                                  <Button
                                    key={suggestion.time}
                                    type="button"
                                    variant={
                                      selectedTime === suggestion.time
                                        ? 'default'
                                        : 'outline'
                                    }
                                    className="flex flex-col h-16"
                                    onClick={() =>
                                      setSelectedTime(suggestion.time)
                                    }
                                  >
                                    <span className="text-lg font-bold">
                                      {suggestion.time}
                                    </span>
                                    <div className="flex items-center text-xs text-muted-foreground">
                                      <Star className="w-3 h-3 mr-1 fill-accent text-accent" />
                                      <span>
                                        {(
                                          suggestion.popularityScore * 10
                                        ).toFixed(1)}
                                      </span>
                                    </div>
                                  </Button>
                                )
                              )}
                            </div>
                          </div>
                        )}
                      {suggestedTimes &&
                        suggestedTimes.suggestedTimes.length > 0 &&
                        availableTimes.length > 0 && <Separator />}

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">
                          Outros Horários
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {availableTimes.map((time) => (
                            <Button
                              key={time}
                              type="button"
                              variant={
                                selectedTime === time ? 'default' : 'outline'
                              }
                              onClick={() => setSelectedTime(time)}
                            >
                              {time}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            )}

            <div className="flex justify-end">
              <Button type="submit" size="lg" disabled={!selectedTime}>
                Confirmar Agendamento
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
