-- Migration pour rendre le champ image obligatoire
-- (après avoir mis à jour tous les badges existants)

ALTER TABLE badge_type ALTER COLUMN image SET NOT NULL;
