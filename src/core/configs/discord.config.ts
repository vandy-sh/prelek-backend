import { registerAs } from '@nestjs/config';
import Joi from 'joi';
import { baseJoiRequiredString } from '../utils/joi.required.string';

/**
 * Discord Config (.env loader)
 * @author RDanang(iyoy)
 */
export interface IDiscordConfig {
  dcNotifLogChannelId?: string;
  dcNotifLogToken?: string;
}

export const discordConfig = registerAs('discordConfig', (): IDiscordConfig => {
  const values = {
    dcNotifLogChannelId: process.env.DISCORD_NOTIF_LOG_CHANNEL_ID,
    dcNotifLogToken: process.env.DISCORD_NOTIF_LOG_TOKEN,
  };

  const schema = Joi.object<IDiscordConfig>({
    dcNotifLogChannelId: baseJoiRequiredString(
      'DISCORD_FUSION_AUTH_CHANNEL_ID',
    ),
    dcNotifLogToken: baseJoiRequiredString('DISCORD_FUSION_AUTH_TOKEN'),
  });

  const { error, value } = schema.validate(values, {
    abortEarly: false,
  });
  if (error) {
    throw new Error(
      `An error occurred while validating the environment variables for Discord: ${error.message}`,
    );
  }

  return values;
});
