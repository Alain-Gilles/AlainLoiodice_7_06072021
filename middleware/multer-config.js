// Pour faciliter la gestion de fichiers envoyés avec des requettes http vers notre API
// Nous allons utiliser un package qui s'appelle multer.
// multer-config.js sert à configurer multer
//
// On commence par importer multer
//
const multer = require("multer");
//
// On se creait un repertoire des MIME_TYPES (type de contenu) de fichiers que l'on peut avoir depuis le frontend
//
const MIME_TYPES = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};
//
// On créait un objet de configuration pour multer que l'on appelle storage
// et on va utiliser une fonction de multer qui s'appelle diskStorage pour dire que l'on va
// l'enregister sur le disque
// L'objet de configuration qu'on passe à diskStorage à besoin de deux éléments
//
// La destination qui est une fonction qui va expliquer à multer dans quel dossier il doit enregistrer les fichiers
// destination est une fonction qui prend trois arguments, la requete, le file et un callback
// dans destination on commence par appeler le callback() en lui passant un premier argument null pour lui dire qu'il n'y a pas
// eu d'erreurs et en deuxièmes arguments le nom du dossier qui contiendra les images donc le dossier "images"
//
// Le deuxième élément qu'à besoin l'objet de configuration c'est filename qui va expliquer à multer quel nom de fichier utiliser
// On a une fonction qui prend la requête, le fichier et un callback
// La fonction va générer le nouveau nom pour le fichier (on ne peut pas prendre le nom du fichier d'origine risque de doublons)
// on creait la constante name qui va contenir le nom de fichier avant l'extension
// on va utiliser le nom d'origine du fichier grâce à file.originalname, cependant il est possible que le nom de fichier
// contienne des espaces car cela peut provoquer des problèmes coté serveur, on va les supprimer et les replacer dar des underscore "_".
// Pour ce faire on utilise la méthode split. On va splier autour des espaces, ce qui va créer un tableau avec les différents mots du nom de fichier
// et on appelle la methode .join pour rejoindre ce tabelau en un seul string avec des underscore "_" qui séparent chaque mot ( à la place des espaces).
//
// La méthode split() divise une chaîne de caractères en une liste ordonnée de sous-chaînes, place ces sous-chaînes dans un tableau et retourne le tableau.
// La division est effectuée en recherchant un motif ; où le motif est fourni comme premier paramètre dans l'appel de la méthode.
//
// La méthode join() crée et renvoie une nouvelle chaîne de caractères en concaténant tous les éléments d'un tableau (ou d'un objet semblable à un tableau).
// La concaténation utilise la virgule ou une autre chaîne, fournie en argument, comme séparateur.
//
// Maintenant il faut que l'on applique une extension au fichier elle correspondra à l'élément de notre dictionnaire MIME_TYPE qui
// correspond au mime_type du fichier envoyé par le front-end
//
// On a notre nom de fichier et notre extension, maintenant on va appeler le callback en lui passant un premier argument null pour dire
// qu'il n'y a pas d'erreurs et en deuxième argument on créait le nom complet = name + Date + "." + extension
//
const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + "." + extension);
  },
});

//
// On exporte le middleware multer complètement configuré
//
module.exports = multer({ storage: storage }).single("image");
