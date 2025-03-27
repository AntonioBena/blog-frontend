export class GenericConstants{
  public static readonly VALIDATION_EMAIL_REGEX = /^[a-zA-Z0-9_+&*-]+(?:\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,7}$/;
  public static readonly VALIDATION_EMAIL_MIN_LENGTH = 8;
  public static readonly VALIDATION_EMAIL_Max_LENGTH = 40;
  public static readonly IMAGE_TAG_REGEX = /<img([^>]*)>/g;
  public static readonly YOUTUBE_REGEX = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|(?:.*[?&])v=))([^"&?/]+)/;
  public static readonly VIDEO_TAG_REGEX = /<video[^>]*src="([^"]*)"[^>]*>/g;
}
