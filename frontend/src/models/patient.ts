export interface PatientWithHemoleucograma{
    _id: string,
    name: string,
    cnp: string,
    doctors: string[],
    description: string,
    Hemoleucograma_completa: Hemoleucograma[],
    createdAt: string,
    updatedAt: string,
}

export interface PatientWithoutHemoleucograma{
    _id: string,
    name: string,
    cnp: string,
    doctors: string[],
    description: string,
    createdAt: string,
    updatedAt: string,
}

export interface Hemoleucograma {
    [key: string]: string; 
}
