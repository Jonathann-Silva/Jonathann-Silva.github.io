import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CalendarCheck, Clock, Scissors, Settings } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboardPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2 text-center md:text-left">
        Dashboard do Administrador
      </h1>
      <p className="text-muted-foreground mb-8 text-center md:text-left">
        Bem-vindo, aqui você pode gerenciar sua barbearia.
      </p>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Agendamentos de Hoje
            </CardTitle>
            <CalendarCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação a ontem
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximo Horário
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">14:30</div>
            <p className="text-xs text-muted-foreground">
              com Cliente Exemplo
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Serviços Populares
            </CardTitle>
            <Scissors className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Cabelo e Barba</div>
            <p className="text-xs text-muted-foreground">
              Serviço mais agendado
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <Card>
            <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
                <CardDescription>Acesse as configurações para ajustar seus horários e serviços.</CardDescription>
            </CardHeader>
            <CardContent>
                <Link href="/admin/settings">
                    <Button>
                        <Settings className="mr-2 h-4 w-4" />
                        Ajustar Configurações
                    </Button>
                </Link>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}
