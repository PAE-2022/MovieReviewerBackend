import { GcpFile } from '@config/multer';
import { CommentDto } from '@dto/users/comment.dto';
import { ModifyUserDto } from '@dto/users/modifiy-user.dto';
import { NotFoundError } from '@errors/http-error';
import { CommentModel } from '@models/comments';
import { Movie, MovieModel } from '@models/movie';
import { UserModel, User } from '@models/user';
import { io } from '@socketio/socketio';

export class UserController {
  async getUserById(currentUserId: string): Promise<User> {
    const user = await UserModel.findById(currentUserId)
      .populate('following')
      .populate('favorites');

    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }
    return user;
  }
  async addMovieToFavorites(userId: string, movieId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }
    const movie = await MovieModel.findById(movieId);
    if (!movie) {
      throw new NotFoundError({
        message: 'Movie not found',
      });
    }
    user.favorites.push(movie._id);
    await user.save();
  }

  async removeMovieFromFavorites(userId: any, movieId: string) {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }

    await user.updateOne({
      $pull: {
        favorites: movieId,
      },
    });
  }

  async addFollow(userId: string, followingId: string): Promise<void> {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }
    const following = await UserModel.findById(followingId);
    if (!following) {
      throw new NotFoundError({
        message: 'User not found',
      });
    }

    io.emit(`following-${followingId}`, {
      message: `${user.name} is now following you`,
    });

    // user.following.push(following._id);
    await user.save();
  }

  async searchUsers(query: string): Promise<Array<User>> {
    const users = await UserModel.find({
      $text: {
        $search: query,
      },
    })
      .populate('following')
      .populate('favorites');

    return users;
  }

  async modifyUser(
    userId: string,
    modifyUserRequest: ModifyUserDto,
  ): Promise<void> {
    await UserModel.updateOne({ _id: userId }, { $set: modifyUserRequest });
  }

  async uploadProfilePicture(userId: string, file: GcpFile): Promise<void> {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { avatar: file.linkUrl } },
    );
  }

  async getUserComments(userId: string): Promise<Array<CommentDto>> {
    const comments = await CommentModel.find({ createdBy: userId }).populate(
      'belongsTo',
    );

    return comments.map((comment) => ({
      content: comment.content,
      movieName: (comment.belongsTo as Movie).name,
      moviePicture: (comment.belongsTo as Movie).cover,
    }));
  }
}
