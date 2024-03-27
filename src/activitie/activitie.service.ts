import { Injectable } from '@nestjs/common';
import { CreateActivitieDto } from './dto/create-activitieDto';
import { ImageActivitie, User } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterActivitieDto } from './dto/register-activitieDto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ActivitieService {
  constructor(private prismaService: PrismaService, private readonly configService: ConfigService,) {}

  private readonly uploadPath = './uploads';

  async deleteFolderRecursive(folderPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(folderPath)) {
        // Si le dossier n'existe pas, résolvez immédiatement
        resolve();
        return;
      }

      fs.readdirSync(folderPath).forEach((file) => {
        const curPath = path.join(folderPath, file);
        if (fs.lstatSync(curPath).isDirectory()) {
          // Si c'est un dossier, récursivement supprimer son contenu
          this.deleteFolderRecursive(curPath).catch((err) => reject(err));
        } else {
          // Si c'est un fichier, le supprimer
          fs.unlinkSync(curPath);
        }
      });

      // Supprimer le dossier lui-même après avoir supprimé son contenu
      fs.rmdir(folderPath, (err) => {
        if (err) {
          console.error(`Erreur lors de la suppression du dossier ${folderPath}`, err);
          reject(err);
        } else {
          console.log(`Dossier ${folderPath} supprimé avec succès`);
          resolve();
        }
      });
    });
  }

  async uploadFile(file: Express.Multer.File, id: string) {
    const uploadDir = this.uploadPath; // Dossier principal où les fichiers sont sauvegardés
    const folderName = id; // Nom du dossier que vous souhaitez créer
    const folderPath = path.join(uploadDir, folderName);

    // Vérifiez si le dossier existe, sinon, créez-le
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath);
    }

    // Obtenez le chemin complet du fichier de destination à l'intérieur du nouveau dossier
    const destinationPath = path.join(
      folderPath,
      `${file.originalname}`,
    );

    // Copiez le fichier téléchargé vers le dossier de destination
    fs.writeFileSync(destinationPath, file.buffer);
    await this.prismaService.imageActivitie.create({
      data: {
        filename: file.originalname,
        activitieId: +id,
      },
    });

    return { message: 'Image téléchargée et sauvegardée avec succès' };
  }

  async create(
    createActivitieDto: CreateActivitieDto,
    userDecorator: User,
    file: Express.Multer.File,
  ) {
    const { name, description, dateDeb, dateFin, prix, addresse } =
      createActivitieDto;

    try {
      // date sous forme YYYY-MM-DDTHH:MM:SS Z exemple: 2024-02-21T12:00:00Z
      const activitie = await this.prismaService.activitie.create({
        data: {
          name,
          description,
          dateDeb,
          dateFin,
          prix,
          addresse,
          creatorId: userDecorator.id,
        },
      });
      const id = activitie.id.toString();
      this.uploadFile(file, id);

      return { message: "L'activité a bien été crée", type: "success" };
    } catch (e) {
      throw new Error(e);
    }
  }

  async getActivitie(id: number) {
    try {
      const activitie = await this.prismaService.activitie.findUnique({
        where: { id },
        select:{
          id:true,
          name: true,
          description: true,
          addresse: true,
          prix: true,
          dateDeb: true,
          dateFin: true,
          CreatedAt: true,
          creator: true
        }
      });
      const imgName = await this.prismaService.imageActivitie.findFirst({
        where: {activitieId: id},
        select: {
          filename: true
        }
      }) 
      const imagePath = path.join(this.configService.get("API_URL"), "/static/",id.toString(),imgName.filename )
      
      return {activitie, imagePath};
    } catch (e) {
      throw new Error(e);
    } finally {
      await this.prismaService.$disconnect();
    }
  }

  async getAllActivities(){
    try {
        const activitiesWithImages = await this.prismaService.activitie.findMany({
            include: {
                ImageActivitie: true,
                creator: true
            },
        });

        // Appliquer une logique spécifique au nom de l'image, par exemple, ajouter un préfixe
        const processedActivities = activitiesWithImages.map(activity => {
            const processedImages = activity.ImageActivitie.map(image => ({
                ...image,
                filename: `${this.configService.get("API_URL")}/static/${activity.id}/${image.filename}`, // Appliquer une logique spécifique au nom de l'image ici
            }));

            return {
                ...activity,
                ImageActivitie: processedImages,
            };
        });

        // processedActivities contient maintenant une liste d'objets modifiés avec les noms d'image modifiés
        console.log(processedActivities);

        return processedActivities;
    } catch (error) {
        console.error(error);
        throw new Error('Erreur lors de la récupération des activités avec images.');
    }

  }

  async deleteActivitie(registerActivitieDto: RegisterActivitieDto){
    const id = parseInt(registerActivitieDto.id)
    //delete dans la table activitie participant 
    console.log(id);
    
    try{
      try {
        await this.prismaService.activitieParticipants.deleteMany({where: {activitieId: id}})
        console.log(1);
        
      }
      catch(e){
        throw new Error(e)
      }
      //delete dans la table img
      try {
        await this.prismaService.imageActivitie.deleteMany({where: {activitieId: id}})
        console.log(2);
        
      }
      catch(e){
        throw new Error(e)
      }
      //delete activity
      try{
        await this.prismaService.activitie.delete({where : { id }})
        console.log(3);
        
      }catch(e){
        throw new Error(e)
      }
      //delete le dossier correspondant a l'id de l'activitie
      const uploadDir = this.uploadPath; // Dossier principal où les fichiers sont sauvegardés
      const folderName = id.toString(); // Nom du dossier que vous souhaitez créer
      const folderPath = path.join(uploadDir, folderName);
      try{
        this.deleteFolderRecursive(folderPath)
      }catch(e){
        throw new Error(e)
      }
      return {message: "L'activité a bien été supprimé "}
    }catch(e){
      return {message: "une erreur est survenue", erreur: e}
    }

    
  }

  async updateActivitie(id: number, createActivitieDto: CreateActivitieDto/*, file: Express.Multer.File*/){
    //Verifier si l'image a été modifier,
    //supprimer l'image dans le dossier et la remplacer par la nouvelle si différente
    //changer le filename dans la table img
    //changer les nouvelles information dans la table activite
    console.log(createActivitieDto);
    
    try{
      await this.prismaService.activitie.update({
        where: { id },
        data: createActivitieDto,
      })
      return {message: "Votre modification a bien été prise en compte"}
    }catch(e){
      throw new Error(e)
    }


  }
//Table Activite Participant

  async alreadyRegister(registerActivitieDto: RegisterActivitieDto, userDecorator: User) {
    const register = await this.prismaService.activitieParticipants.findUnique({
      where: {
        userId_activitieId: { userId: userDecorator.id, activitieId: +registerActivitieDto.id },
      },
    });
    if (register) {
      return {type: 'success'};
    } else {
      return {type: 'fail'};
    }
  }

  async registerActivitie(
    registerActivitieDto: RegisterActivitieDto,
    userDecorator: User,
  ) {
    const ifRegister = await this.alreadyRegister(
      registerActivitieDto,
      userDecorator,
    );
    if (ifRegister.type == 'fail') {
      try {
        await this.prismaService.activitieParticipants.create({
          data: {
            userId: userDecorator.id,
            activitieId: +registerActivitieDto.id,
          },
        });
        return { message: 'Vous vous êtes bien inscript à cette activité', type: "success" };
      } catch (e) {
        throw new Error(e);
      }
    } else {
      return {message: 'Vous êtes déja inscrit a cette activité'};
    }
  }

  async allParticipants(registerActivitieDto: RegisterActivitieDto) {
    const id = parseInt(registerActivitieDto.id)
    const participants =
      await this.prismaService.activitieParticipants.findMany({
        where: { activitieId: id },
        select: {
          
          //activitieId: true,
          user: {
              select: {
                  id: true,
                  firstName: true,
                  lastName: true,
                  email: true,
                  classe: true,
                  filiere: true,
                  roles: true,
              }
          },
      }
      });
    // participants contient maintenant une liste d'objets contenant les utilisateurs liés à l'activité
    return {data: participants, type: "success"};
  }
}
