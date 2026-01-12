import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();

    // Validar que se proporcionó un código
    if (!code || typeof code !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Por favor ingresa un código' },
        { status: 400 }
      );
    }

    // Obtener el código correcto de las variables de entorno
    const eventCode = process.env.EVENT_CODE;

    if (!eventCode) {
      console.error('EVENT_CODE no está configurado en las variables de entorno');
      return NextResponse.json(
        { success: false, error: 'Error de configuración del servidor' },
        { status: 500 }
      );
    }

    // Comparar códigos (ignorando mayúsculas/minúsculas y espacios)
    const isValid = code.trim().toUpperCase() === eventCode.trim().toUpperCase();

    if (isValid) {
      return NextResponse.json({
        success: true,
        message: '¡Bienvenido! Acceso concedido',
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Código incorrecto. Intenta de nuevo.' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Error en autenticación:', error);
    return NextResponse.json(
      { success: false, error: 'Error del servidor' },
      { status: 500 }
    );
  }
}