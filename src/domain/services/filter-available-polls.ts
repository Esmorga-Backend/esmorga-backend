import { PollDto } from '../../infrastructure/dtos';

/**
 * Filter the poll list discarting
 *
 * @param {PollDto[]} pollList - List of polls to filter.
 * @returns {PollDto[]} - Filtered and ordered list of polls.
 */
export function filterAvailablePolls(pollList: PollDto[]): PollDto[] {
  const now = new Date();
  const twoDaysAgo = new Date(now);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  const acceptedPolls = pollList.filter((poll) => {
    const pollDate = new Date(poll.voteDeadline);
    return pollDate >= twoDaysAgo;
  });

  const pastPolls = acceptedPolls
    .filter((poll) => new Date(poll.voteDeadline) < now)
    .sort(
      (a, b) =>
        new Date(a.voteDeadline).getTime() - new Date(b.voteDeadline).getTime(),
    );

  const upcomingPolls = acceptedPolls
    .filter((poll) => new Date(poll.voteDeadline) >= now)
    .sort(
      (a, b) =>
        new Date(a.voteDeadline).getTime() - new Date(b.voteDeadline).getTime(),
    );

  return [...pastPolls, ...upcomingPolls];
}
