const axios = require('axios');

// Datos de autenticación y la URL de tu JIRA
const BASE_URL = 'https://tcms.aiojiraapps.com/aio-tcms/rest/aio-tcms/1.0';
const JIRA_USERNAME = process.env.JIRA_USERNAME;
const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
// ID del proyecto y del caso de prueba que quieres actualizar
const PROJECT_ID = '10000'; // Reemplaza con tu ID de proyecto
const TESTCASE_ID = '19'; // Reemplaza con tu ID de caso de prueba

// Crear una instancia de axios con la configuración común
const req = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  auth: {
    username: JIRA_USERNAME,
    password: JIRA_API_TOKEN,
  },
});

// Función para obtener los detalles del caso de prueba
const getTestCase = async () => {
  const url = `/project/${PROJECT_ID}/testcase/${TESTCASE_ID}`;
  const response = await req.get(url);
  return response.data;
};

// Función para actualizar el caso de prueba
const updateTestCase = async (testCase) => {
  const url = `/project/${PROJECT_ID}/testcase/${TESTCASE_ID}`;
  const payload = {
    ...testCase,
    status: 'Automated', // Cambiar el estado a "Automated"
  };
  await req.put(url, payload);
};

// Función principal para cambiar el estado del caso de prueba
const changeTestCaseStatus = async () => {
  try {
    // Obtener los detalles del caso de prueba
    const testCase = await getTestCase();

    // Verificar el estado actual
    if (testCase.status === 'To be automated') {
      // Actualizar el caso de prueba al nuevo estado
      await updateTestCase(testCase);
      console.log(
        "Estado del caso de prueba cambiado a 'Automated' exitosamente.",
      );
    } else {
      console.log(
        "El estado del caso de prueba no es 'To be automated'. No se realizó ningún cambio.",
      );
    }
  } catch (error) {
    if (error.response) {
      console.error(
        `Error al cambiar el estado del caso de prueba: ${error.response.status}, ${error.response.statusText}`,
      );
      console.error('Response data:', error.response.data);
      console.error('Response headers:', error.response.headers);
    } else if (error.request) {
      console.error('No se recibió respuesta del servidor:', error.request);
    } else {
      console.error('Error al configurar la solicitud:', error.message);
    }
  }
};

// Ejecutar la función principal
changeTestCaseStatus();
