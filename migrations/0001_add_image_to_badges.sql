-- Migration pour ajouter le champ image aux badges
-- Ajout du champ image à la table badge_type

ALTER TABLE badge_type ADD COLUMN image TEXT;

-- Mettre à jour les badges existants avec une valeur par défaut si nécessaire
-- UPDATE badge_type SET image = NULL WHERE image IS NULL;
