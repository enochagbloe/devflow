import { ActionResponse, Answer, Author } from "@/types/global"
import AnswerCard from "../card/AnswerCard";

interface Props extends ActionResponse<Answer[]>{
    totalAnswers: number;
    author: Author;
    answer: Answer;
}

const AnswerPage = ({success, error, data, totalAnswers, author, answer} : Props) => {
  return (
    <main className="">
      <div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-center sm:gap-2'>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "answer" : "answers"}
        </h2>
        <p>filter</p>
      </div>
      <div className="flex flex-col gap-5">
        {data?.map((answers) => (
          <div key={answers._id} className="w-full rounded-lg border-dark300 pt-8">
           <AnswerCard _id={answers._id}  answer={answers} author={author} />
          </div>
        ))}
      </div>
    </main>
  )
}

export default AnswerPage
