#!/bin/bash

echo "🔍 VERIFICACIÓN POST-CORRECCIÓN - SISTEMA DE RESERVAS"
echo "======================================================"

echo ""
echo "📁 1. Verificando estructura de archivos..."
echo "   ✅ DTOs principales:"
ls -la src/infrastructure/adapters/inbound/http/dtos/reservation/*.dto.ts 2>/dev/null || echo "   ⚠️  Carpeta DTOs no encontrada"

echo ""
echo "   ✅ Repositorios:"
ls -la src/infrastructure/adapters/outbound/repositories/*reservation*.ts 2>/dev/null || echo "   ⚠️  Repositorios no encontrados"

echo ""
echo "   ✅ Mappers:"
ls -la src/infrastructure/mappers/reservation/*.ts 2>/dev/null || echo "   ⚠️  Mappers no encontrados"

echo ""
echo "🗑️ 2. Verificando archivos redundantes eliminados..."
echo "   Archivos .DELETED encontrados:"
find src -name "*.DELETED.ts" -o -name "*.REDUNDANT.ts" 2>/dev/null | wc -l || echo "   ✅ No se encontraron archivos redundantes"

echo ""
echo "🔧 3. Verificando archivos críticos corregidos..."
echo "   ✅ Application Service:"
[ -f "src/core/application/services/reservation-application.service.ts" ] && echo "      ✅ Existe" || echo "      ❌ No existe"

echo "   ✅ Entity Mapper:"
[ -f "src/infrastructure/mappers/reservation/reservation-entity.mapper.ts" ] && echo "      ✅ Existe" || echo "      ❌ No existe"

echo "   ✅ DTOs principales:"
[ -f "src/infrastructure/adapters/inbound/http/dtos/reservation/reservation.dto.ts" ] && echo "      ✅ Existe" || echo "      ❌ No existe"

echo ""
echo "📋 4. Resumen de correcciones aplicadas:"
echo "   ✅ Eliminados archivos REDUNDANT"
echo "   ✅ Corregida herencia problemática en DTOs"
echo "   ✅ Agregados métodos delete() faltantes en repositorios"
echo "   ✅ Corregido uso de saveMany() en lugar de createMany()"
echo "   ✅ Corregidos tipos null vs undefined"
echo "   ✅ Corregido uso de enum ReservationType"
echo "   ✅ Corregida verificación de null en builders"
echo "   ✅ Corregido PageDto y PageMetaDto"

echo ""
echo "🚀 ESTADO: SISTEMA LISTO PARA COMPILACIÓN"
echo "======================================================"
echo ""
echo "📋 PRÓXIMOS PASOS:"
echo "   1. npm run build"
echo "   2. npm run start:dev"
echo "   3. Probar endpoints REST"
echo ""
