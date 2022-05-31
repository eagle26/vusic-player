interface IComment {
  comment: string;
  userID: string;
  songID: string;
  author: string;
  postedAt: string;
}

interface ICommentFirebase extends IComment {
  docID: string;
}

export type { IComment, ICommentFirebase };
