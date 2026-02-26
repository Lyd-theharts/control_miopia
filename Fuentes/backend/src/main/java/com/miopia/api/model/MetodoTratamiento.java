package com.miopia.api.model;

public enum MetodoTratamiento {
    NINGUNO,
    GAFAS, // Genérico
    GAFAS_MIYOSMART, // Hoya
    GAFAS_STELLEST, // Essilor
    GAFAS_MYOSLOW, // Indo
    LENTILLAS, // Genérico
    LENTILLAS_MISIGHT, // CooperVision
    LENTILLAS_ORTOK, // Ortoqueratología
    ORTOK, // Genérico OrtoK
    ATROPINA, // Genérico
    ATROPINA_001, // Dosis 0.01%
    ATROPINA_005, // Dosis 0.05%
    COMBINADO // Ej: OrtoK + Atropina
}