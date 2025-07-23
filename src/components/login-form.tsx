'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { AtSign, Loader2, Lock, Phone, User } from 'lucide-react';
import { useRouter } from 'next/navigation';

const FormSchema = z
  .object({
    name: z.string().optional(),
    email: z
      .string({ required_error: 'Por favor, insira seu email.' })
      .email('Por favor, insira um email válido.'),
    phone: z.string().optional(),
    password: z
      .string({ required_error: 'Por favor, insira sua senha.' })
      .min(6, 'A senha deve ter pelo menos 6 caracteres.'),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.confirmPassword && data.password !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: 'As senhas não correspondem.',
      path: ['confirmPassword'],
    }
  )
  .refine(
    (data) => {
        // These fields are required only when confirmPassword is being used (i.e., sign up)
        if (data.confirmPassword !== undefined) {
            return !!data.name && !!data.phone;
        }
        return true;
    },
    {
        message: 'Este campo é obrigatório.',
        path: ['name'], // Or ['phone'] - refine will attach it to one. We'll handle showing the message on both.
    }
  );


export function LoginForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [isSignUp, setIsSignUp] = React.useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
    },
  });

  React.useEffect(() => {
    // When toggling between sign-in and sign-up, clear the confirmPassword
    // and conditionally set its presence to trigger validation correctly.
    form.setValue('confirmPassword', isSignUp ? '' : undefined);
    form.setValue('name', isSignUp ? '' : undefined);
    form.setValue('phone', isSignUp ? '' : undefined);
    // Clear errors when switching forms
    form.clearErrors();
  }, [isSignUp, form]);


  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setLoading(true);
    try {
      if (isSignUp) {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          data.email,
          data.password
        );
        // We're not storing the phone number in auth, but you could save it to a database here.
        if (userCredential.user && data.name) {
          await updateProfile(userCredential.user, {
            displayName: data.name,
          });
        }
        toast({
          title: 'Conta Criada!',
          description: 'Você foi registrado com sucesso e já pode se conectar.',
        });
        setIsSignUp(false); // Switch to login view after successful sign up
        form.reset();
      } else {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        toast({
          title: 'Login bem-sucedido!',
          description: 'Bem-vindo de volta!',
        });
        router.push('/');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      const errorCode = error.code;
      let errorMessage = 'Ocorreu um erro. Tente novamente.';
      if (errorCode === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta. Por favor, tente novamente.';
      } else if (errorCode === 'auth/user-not-found') {
        errorMessage = 'Nenhum usuário encontrado com este email.';
      } else if (errorCode === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso por outra conta.';
      } else if (errorCode === 'auth/invalid-email') {
        errorMessage = 'O formato do email é inválido.';
      } else if (errorCode === 'auth/user-disabled') {
        errorMessage = 'Este usuário foi desabilitado.';
      }
      toast({
        variant: 'destructive',
        title: isSignUp ? 'Erro ao criar conta' : 'Erro de Login',
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="w-full shadow-lg border-2 border-primary/10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-center">
              {isSignUp ? 'Criar Conta' : 'Acessar Conta'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {isSignUp && (
              <>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <User className="h-4 w-4 opacity-70" /> Nome
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Seu nome completo" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <AtSign className="h-4 w-4 opacity-70" /> Email
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="seu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {isSignUp && (
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Phone className="h-4 w-4 opacity-70" /> Telefone
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="(99) 99999-9999" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Lock className="h-4 w-4 opacity-70" /> Senha
                  </FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             {isSignUp && (
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Lock className="h-4 w-4 opacity-70" /> Confirmar Senha
                    </FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button
              type="submit"
              size="lg"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isSignUp ? 'Registrar' : 'Entrar'}
            </Button>
            <Button
              type="button"
              variant="link"
              size="sm"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp
                ? 'Já tem uma conta? Faça login.'
                : 'Não tem uma conta? Crie uma.'}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
