# PRT2015
End of studies technical project using AngularJS NodeJS and neo4j

git pull origin master ( recupere origin et le merge dans master... marche aussi avec d'autres branches )
git status
git checkout -b ( creer une nouvelle branche )
git checkout ( change de branche )
git branch ( montre toute les branches )
git branch -d ( delete si branche merge dans master )
git branch -D ( delete forced )
git reset --hard (reset la branche sur le dernier merge )
git add . ( add tout les fichiers au commit )
git commit -m "commentaire"
git push origin branchelocale ( push sur origin )
git fetch --all ( recupere toutes les nouvelles branches push sur origin )
git merge nom_de_la_branche_a_merge branche_qui_reçoit la merge
git stash ( sauvegarde branche )
git stash pop => recuperer la sauvegarde
git cherrypick #commit ( recuperer un commit d'une pull request ) plus trop sur
git reverse ( annuler le commit ) 

#Guidelines

Création : 

1. git checkout master 
2. git pull origin staging
3. git checkout -b NOM_BRANCHE
4. git checkout  (vérifier si bonne branche)

Ajout de code :

git status 
git add => si tu veux tout ajouter : git add . 
git commit -m " commentaire " 
git push origin NOM_BRANCHE
Aller sur github et verifier qu'il n'y a pas de merge conflict / test fail 

Si merge conflict => contacter la personne avec qui y'a le conflit, ouvrir le fichier dans l'IDE et le modifier. 





