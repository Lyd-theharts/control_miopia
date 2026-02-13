export interface LoginUserDTO {
    username?: string;
    password?: string;
}

export interface LoginResponse {
    token: string;
    username: string;
}

export interface Paciente {
    id: number;
    nombre: string;
    apellidos?: string;
    fechaNacimiento?: string;
    sexo?: string;
    telefono?: string;
    emailTutor?: string;
    nombreTutor?: string;
    fechaAlta?: string;
    clinicaId: number;
}

export interface Optometrista {
    id: number;
    nombreCompleto: string;
    numeroColegiado: string;
    clinicaId?: number;
}

export interface Revision {
    id?: number; // Opcional al crear
    fechaRevision: string;
    anamnesis?: string;

    // 1. REFRACCIÓN
    odEsfera?: number;
    odCilindro?: number;
    odEje?: number;
    odAgudezaVisual?: number;
    oiEsfera?: number;
    oiCilindro?: number;
    oiEje?: number;
    oiAgudezaVisual?: number;

    // 2. BIOMETRÍA
    odK1?: number;
    odK2?: number;
    odLongitudAxial?: number;
    oiK1?: number;
    oiK2?: number;
    oiLongitudAxial?: number;

    // 3. VISIÓN BINOCULAR
    foriaLejos?: string;
    foriaCerca?: string;
    ppc?: number;
    mem?: number;
    ac_a?: number;
    stereopsis?: number;

    // 4. TRATAMIENTO
    tratamientoActual?: string; // Enum en Java, string aquí
    alertasSistema?: string;

    // RELACIONES
    paciente?: { id: number }; // Objeto anidado
    optometrista?: { id: number }; // Objeto anidado
}
