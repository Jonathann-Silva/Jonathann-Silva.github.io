
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Save, Clock, Coffee, Scissors } from 'lucide-react';

const services = [
  { id: 'haircut', name: 'Corte de Cabelo' },
  { id: 'shave', name: 'Barba' },
  { id: 'both', name: 'Cabelo e Barba' },
];

const daysOfWeek = [
  { id: 'segunda', label: 'Segunda-feira' },
  { id: 'terca', label: 'Terça-feira' },
  { id: 'quarta', label: 'Quarta-feira' },
  { id: 'quinta', label: 'Quinta-feira' },
  { id: 'sexta', label: 'Sexta-feira' },
  { id: 'sabado', label: 'Sábado' },
  { id: 'domingo', label: 'Domingo' },
];

const SettingsFormSchema = z.object({
  workingDays: z.array(z.string()).refine((value) => value.some((item) => item), {
    message: 'Você deve selecionar pelo menos um dia de trabalho.',
  }),
  startTime: z.string().min(1, { message: 'Campo obrigatório.' }),
  endTime: z.string().min(1, { message: 'Campo obrigatório.' }),
  lunchStartTime: z.string().min(1, { message: 'Campo obrigatório.' }),
  lunchEndTime: z.string().min(1, { message: 'Campo obrigatório.' }),
  serviceDurations: z.record(z.string().min(1, { message: 'Duração obrigatória.' })),
});

export default function AdminSettingsPage() {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof SettingsFormSchema>>({
    resolver: zodResolver(SettingsFormSchema),
    defaultValues: {
      workingDays: ['segunda', 'terca', 'quarta', 'quinta', 'sexta', 'sabado'],
      startTime: '09:00',
      endTime: '19:00',
      lunchStartTime: '12:00',
      lunchEndTime: '13:00',
      serviceDurations: {
        haircut: '30',
        shave: '30',
        both: '60',
      },
    },
  });

  function onSubmit(data: z.infer<typeof SettingsFormSchema>) {
    toast({
      title: 'Configurações Salvas!',
      description: 'Suas novas configurações foram salvas com sucesso.',
    });
    console.log(data);
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-center md:text-left">
        Configurações
      </h1>
      <p className="text-muted-foreground mb-8 text-center md:text-left">
        Ajuste os horários de funcionamento, almoço e a duração dos serviços.
      </p>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="w-5 h-5"/> Horários de Trabalho</CardTitle>
              <CardDescription>Defina os dias e horários em que a barbearia está aberta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="workingDays"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Dias de Funcionamento</FormLabel>
                      <FormDescription>
                        Selecione os dias da semana em que a barbearia está aberta.
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {daysOfWeek.map((day) => (
                      <FormField
                        key={day.id}
                        control={form.control}
                        name="workingDays"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={day.id}
                              className="flex flex-row items-start space-x-3 space-y-0"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(day.id)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, day.id])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== day.id
                                          )
                                        )
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="font-normal">
                                {day.label}
                              </FormLabel>
                            </FormItem>
                          )
                        }}
                      />
                    ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid sm:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Abertura</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Horário de Fechamento</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Coffee className="w-5 h-5"/> Horário de Almoço</CardTitle>
              <CardDescription>Defina o período de pausa para o almoço.</CardDescription>
            </CardHeader>
            <CardContent className="grid sm:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="lunchStartTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Início do Almoço</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lunchEndTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fim do Almoço</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Scissors className="w-5 h-5"/> Duração dos Serviços</CardTitle>
              <CardDescription>Defina o tempo padrão em minutos para cada serviço oferecido.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service, index) => (
                <FormField
                  key={service.id}
                  control={form.control}
                  name={`serviceDurations.${service.id}`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{service.name}</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                           <Input type="number" placeholder="Ex: 30" {...field} />
                           <span className="text-sm text-muted-foreground">minutos</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button type="submit" size="lg">
              <Save className="mr-2 h-4 w-4"/>
              Salvar Configurações
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
