import { FilterQuery } from "mongoose";
import { omit } from "lodash";
import UserModel, { UserDocument, UserInput } from "../models/User.model";
import { databaseResponseTimeHistogram } from "../utils/metrics";

export async function findUsers() {
  const metricsLabels = {
    operation: "findUsers",
  };

  const timer = databaseResponseTimeHistogram.startTimer();
  try {
    const results = await UserModel.find().select("-password");
    timer({ ...metricsLabels, success: "true" });
    return results;
  } catch (e) {
    timer({ ...metricsLabels, success: "false" });

    throw e;
  }
}

export async function createUser(input: UserInput) {
  try {
    const user = await UserModel.create(input);

    return omit(user.toJSON(), [
      "password",
      "createdAt",
      "updatedAt",
      "role",
      "__v",
    ]);
  } catch (e: any) {
    throw new Error(e);
  }
}

export async function validatePassword({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const user = await UserModel.findOne({ email });

  if (!user) {
    return false;
  }

  const isValid = await user.comparePassword(password);

  if (!isValid) return false;

  return omit(user.toJSON(), "password");
}

export async function findUser(query: FilterQuery<UserDocument>) {
  return UserModel.findOne(query).lean();
}
