"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const petSchema = new mongoose_1.Schema({
    nome: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    dono: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    raca: {
        type: mongoose_1.Schema.Types.String,
        required: false,
    },
    idade: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    peso: {
        type: mongoose_1.Schema.Types.String,
        required: true,
    },
    images: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: "Images",
        },
    ],
}, { timestamps: true });
exports.default = (0, mongoose_1.model)("Pets", petSchema);
