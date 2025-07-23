// Este script define um usuário como administrador no Firebase Authentication.
// Uso: node scripts/set-admin.js <email_do_usuario>

const admin = require('firebase-admin');

// ! IMPORTANTE !
// Antes de rodar, você precisa baixar a chave da sua conta de serviço do Firebase
// e apontar a variável de ambiente GOOGLE_APPLICATION_CREDENTIALS para o caminho dela.
// Veja: https://firebase.google.com/docs/admin/setup#initialize-sdk

try {
  admin.initializeApp({
    // Se a variável GOOGLE_APPLICATION_CREDENTIALS estiver configurada,
    // o projectId será detectado automaticamente.
    // Caso contrário, descomente a linha abaixo e adicione o ID do seu projeto.
    // projectId: 'torelli-e-anchar-agendamentos',
  });
} catch (error) {
  console.error(
    'Erro de inicialização do Firebase Admin. Verifique se as suas credenciais (GOOGLE_APPLICATION_CREDENTIALS) estão configuradas corretamente.'
  );
  process.exit(1);
}

const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Por favor, forneça o e-mail do usuário como argumento.');
  console.log('Uso: node scripts/set-admin.js <email_do_usuario>');
  process.exit(1);
}

async function setAdminClaim() {
  try {
    const user = await admin.auth().getUserByEmail(userEmail);
    await admin.auth().setCustomUserClaims(user.uid, { admin: true });
    console.log(`Sucesso! O usuário ${userEmail} (UID: ${user.uid}) agora é um administrador.`);
  } catch (error) {
    if (error.code === 'auth/user-not-found') {
      console.error(`Erro: Nenhum usuário encontrado com o e-mail: ${userEmail}`);
    } else {
      console.error('Erro ao tentar definir a permissão de administrador:', error.message);
    }
    process.exit(1);
  }
}

setAdminClaim();
