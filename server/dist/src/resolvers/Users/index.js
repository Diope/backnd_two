"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResolver = void 0;
const type_graphql_1 = require("type-graphql");
const bcryptjs_1 = require("bcryptjs");
const User_1 = require("../../entity/User");
const auth_1 = require("../../utils/auth");
const isAuthorized_1 = require("../../Middleware/isAuthorized");
const sendRefreshToken_1 = require("../../utils/sendRefreshToken");
const typeorm_1 = require("typeorm");
let UserResponse = class UserResponse {
};
__decorate([
    type_graphql_1.Field(() => [FieldError], { nullable: true }),
    __metadata("design:type", Array)
], UserResponse.prototype, "errors", void 0);
__decorate([
    type_graphql_1.Field(() => User_1.User, { nullable: true }),
    __metadata("design:type", User_1.User)
], UserResponse.prototype, "user", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UserResponse.prototype, "accessToken", void 0);
UserResponse = __decorate([
    type_graphql_1.ObjectType()
], UserResponse);
let UsernamePasswordInput = class UsernamePasswordInput {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "username", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], UsernamePasswordInput.prototype, "password", void 0);
UsernamePasswordInput = __decorate([
    type_graphql_1.InputType()
], UsernamePasswordInput);
let FieldError = class FieldError {
};
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "field", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", String)
], FieldError.prototype, "message", void 0);
__decorate([
    type_graphql_1.Field(),
    __metadata("design:type", Number)
], FieldError.prototype, "statusCode", void 0);
FieldError = __decorate([
    type_graphql_1.ObjectType()
], FieldError);
let UserResolver = class UserResolver {
    users() {
        return User_1.User.find();
    }
    refreshTokenRevoke(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield typeorm_1.getConnection().getRepository(User_1.User).increment({ id: userId }, 'tokenVersion', 1);
            return "Refresh tokens have been revoked";
        });
    }
    register(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const regex = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
            if (options.username.length < 3 || options.username.length > 20) {
                return {
                    errors: [{
                            field: 'username',
                            message: "Username must be 3-20 character. Please try anothe username."
                        }]
                };
            }
            if (options.password.length < 8) {
                return {
                    errors: [{
                            field: 'password',
                            message: "Your password must have a minimum length of 8 characters"
                        }]
                };
            }
            if (!regex.test(options.email)) {
                return {
                    errors: [{
                            field: 'email',
                            message: "Please provide a valid email address",
                            statusCode: 422
                        }]
                };
            }
            const hashedPass = yield bcryptjs_1.hash(options.password, 16);
            const user = new User_1.User();
            user.username = options.username;
            user.password = hashedPass;
            user.email = options.email;
            try {
                yield user.save();
            }
            catch (error) {
                if (error.code === '23505') {
                    return {
                        errors: [{
                                statusCode: 422,
                                field: "Username",
                                message: `The username '${options.username}' is already in use. Please choose another username.`
                            }]
                    };
                }
            }
            return { user };
        });
    }
    login(options, { res }) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ where: { username: options.username } });
            if (!user) {
                return {
                    errors: [{
                            statusCode: 422,
                            field: 'username',
                            message: `The user ${options.username} cannot be found, please check the spelling and try again.`
                        }]
                };
            }
            const valid = yield bcryptjs_1.compare(options.password, user.password);
            if (!valid) {
                return {
                    errors: [{
                            statusCode: 422,
                            field: "password",
                            message: "The provided password is incorrect, please try again."
                        }]
                };
            }
            sendRefreshToken_1.sendRefreshToken(res, auth_1.createRefreshToken(user));
            return { accessToken: auth_1.createAccessToken(user) };
        });
    }
};
__decorate([
    type_graphql_1.Query(() => String),
    type_graphql_1.UseMiddleware(isAuthorized_1.isAuthorized),
    type_graphql_1.Query(() => [User_1.User]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserResolver.prototype, "users", null);
__decorate([
    type_graphql_1.Mutation(() => String),
    __param(0, type_graphql_1.Arg('userId', () => type_graphql_1.Int)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "refreshTokenRevoke", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "register", null);
__decorate([
    type_graphql_1.Mutation(() => UserResponse),
    __param(0, type_graphql_1.Arg('options')),
    __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [UsernamePasswordInput, Object]),
    __metadata("design:returntype", Promise)
], UserResolver.prototype, "login", null);
UserResolver = __decorate([
    type_graphql_1.Resolver()
], UserResolver);
exports.UserResolver = UserResolver;
//# sourceMappingURL=index.js.map