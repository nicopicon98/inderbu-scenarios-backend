import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'fs';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FileStorageService {
  private readonly uploadDir = join(process.cwd(), 'uploads/images');

  constructor() {
    // Asegurar que el directorio de subida exista
    if (!existsSync(this.uploadDir)) {
      mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Guarda un archivo en el sistema de archivos
   * @param file Archivo a guardar
   * @returns Ruta relativa del archivo guardado
   */
  async saveFile(file: Express.Multer.File): Promise<string> {
    // Validar que el archivo exista y tenga contenido
    if (!file || !file.buffer) {
      throw new Error('Archivo inválido o vacío');
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const relativePath = `/uploads/images/${fileName}`;
    const fullPath = join(this.uploadDir, fileName);

    // Guardar el archivo usando writeFileSync (más directo que pipeline para buffers)
    try {
      writeFileSync(fullPath, file.buffer);
      return relativePath;
    } catch (error) {
      console.error(`Error al guardar archivo: ${error.message}`);
      throw new Error(`No se pudo guardar el archivo: ${error.message}`);
    }
  }

  /**
   * Elimina un archivo del sistema de archivos
   * @param relativePath Ruta relativa del archivo a eliminar
   * @returns true si se eliminó correctamente, false si no existía
   */
  async deleteFile(relativePath: string): Promise<boolean> {
    if (!relativePath) return false;

    try {
      // Ajustar la ruta si no incluye 'uploads'
      let fullPath = '';
      if (relativePath.startsWith('/uploads/')) {
        fullPath = join(process.cwd(), relativePath);
      } else {
        fullPath = join(process.cwd(), 'uploads', relativePath);
      }
      
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error(`Error al eliminar el archivo ${relativePath}:`, error);
      return false;
    }
  }
}
