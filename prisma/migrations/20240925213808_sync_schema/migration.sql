-- CreateTable
CREATE TABLE `TypeCandidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name_type` VARCHAR(255) NOT NULL,
    `description` TEXT NULL,
    `type` VARCHAR(2) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GroupCandidates` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sub_election_id` INTEGER NOT NULL,
    `number_list` VARCHAR(2) NOT NULL,
    `img` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Candidate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type_candidate_id` INTEGER NOT NULL,
    `group_candidate_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_type_candidate_id_fkey` FOREIGN KEY (`type_candidate_id`) REFERENCES `TypeCandidate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Candidate` ADD CONSTRAINT `Candidate_group_candidate_id_fkey` FOREIGN KEY (`group_candidate_id`) REFERENCES `GroupCandidates`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
