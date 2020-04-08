# Projet Développement Mobile Ionic
## M2GI-MOBILE est un projet scolaire ionic cordova permettant de gerer des listes de tâches à faire, telles que des devoirs scolaires, des listes de courses, etc.  
## Groupe 14
* SHEIKHIOSKOUEI SOMAYEH 
* BENMOUSSA NADIA
### IMPORTANT:
 Cette application est conçue pour marcher sur le système d'exploitation Android.
## Installation
`NOTE: Si vous êtes un utilisateur MAC ou Linux, vous devrez ajouter sudo avant les commandes d'installation`  

1.	Cloner le dépot github avec la commande: git clone https://github.com/hirouka/todolist.git 
2.  Entrer dans le dossier de projet 
    ```
    cd todolist
    ```
3.	Installer [NodeJS](https://nodejs.org/en/download/) 

4.	Installer Ionic CLI avec la commande:  
    ```
     npm install -g @ionic/cli
    ```
5.	Installer les dépendances avec la commande 
    ```
    npm install
    ````
6. Installer Cordova avec la commande
    ```
    npm i -g cordova
    ```
7.	Ajouter la plateforme android avec la commande
    ```
     ionic cordova platform add android 
     ```  
##	Exécution 
* Execution sur emulateur ou appareil Android (toutes les fonctionnalités) :
    ```
    ionic cordova run android
    ```   
    Si le téléphone est branché à votre ordinateur, l’application sera installé et lancé automatiquement sur votre téléphone.
    Si votre téléphone n’est pas branché à votre ordinateur et vous avez installe emulateur d'android sur votre ordinateur, l’application se lance automatiquement sur l’émulateur.   

* Execution sur navigateur (une partie des fonctionnalités) :
    ```  
    ionic serve
    ```

## Fonctionnalités implémentées
1.	Inscription et authentification par : 
    *	adresse mail et mot de passe  
    *	compte google
 	*   compte facebook   

2.  Récupération d’un mot de passe 
3.	Afficher les listes de tâches  
4.	Créer une liste des tâches par :
    *	Insérer un titre avec clavier 
    *	Insérer un titre en utilisant  le microphone de google assistant 
5.	Enregistrer la position de création de la tâche à la création de la liste de tâche à condition que le GPS est allumé  
6.	Supprimer Une liste des tâches 
7.	Partager avec adresse mail une liste des tâches en lecture et écriture (à choisir)
8.	Chercher une liste de tâches
9.	Afficher les tâches d’une liste 
10.	Créer des tâches pour une liste par : 
    *	Insérer un titre, description avec clavier 
    *	Insérer un titre, description en utilisant le microphone de google assistant 
11.	Supprimer une tâche 
12.	Modifier une tâche 
13.	Changer le statut d’une tâche (Barrer une tâche finie)
14.	Récupérer les informations de l'utilisateur courant (nom, prénom, adresse mail, photo de profile)
14. Changer la photo de profile soit en sélectionnant dans la galerie , ou utiliser la caméra
15.	Détecter et enregistrer la position actuelle de l’utilisateur et l’afficher sur une map
16.	Déconnexion   
## Qualité du code   
Afin de voir la qualité de notre code on a utilisé l'outil [CodeBeat](https://codebeat.co/projects/github-com-hirouka-todolist-master)


## Pour voir quelques capture de l'application cliquez <a href="https://drive.google.com/drive/folders/1nUZDHZWTr7JU24xh2oq25hYQIsehFofy?usp=sharing">ici  </a>




