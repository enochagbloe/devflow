# DevFlow Development Notes

## Question Details Page Implementation

### Overview

Implemented a comprehensive question details page that displays individual questions with full metadata, user information, and interactive elements.

### File Location

`app/(root)/questions/[id]/page.tsx`

### Key Features Implemented

#### 1. Imports and Dependencies

```tsx
import TagCard from "@/components/card/TagCard";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { formatViewsNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams, Tag } from "@/types/global";
import { Link } from "lucide-react";
import React from "react";
```

#### 2. Sample Data Structure

Created a comprehensive sample question object to simulate real data:

```tsx
const sampleQuestion = {
  id: "q123",
  title: "How to improve React app performance?",
  content: `### Question
I'm looking for tips and best practices to enhance the performance of a React application. I have a moderately complex app with multiple components, and I've noticed some performance bottlenecks. What should I focus on?

#### What I've Tried:
- Lazy loading components
- Using React.memo on some components
- Managing state with React Context API

#### Issues:
- The app still lags when rendering large lists.
- Switching between pages feels sluggish.
- Sometimes, re-renders happen unexpectedly.

#### Key Areas I Need Help With:
1. Efficiently handling large datasets.
2. Reducing unnecessary re-renders.
3. Optimizing state management.

Here is a snippet of my code that renders a large list. Maybe I'm doing something wrong here:
\`\`\`js
import React, { useState, useMemo } from "react";
const LargeList = ({ items }) => {
  const [filter, setFilter] = useState("");
  // Filtering items dynamically
  const filteredItems = useMemo(() => {
    return items.filter((item) => item.includes(filter));
  }, [items, filter]);
  return (
    <div>
      <input
        type="text"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
        placeholder="Filter items"
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};
export default LargeList;
\`\`\`

#### Questions:
1. Is using \`useMemo\` the right approach here, or is there a better alternative?
2. Should I implement virtualization for the list? If yes, which library would you recommend?
3. Are there better ways to optimize state changes when dealing with user input and dynamic data?

Looking forward to your suggestions and examples!
**Tags:** React, Performance, State Management`,
  createdAt: "2025-01-15T12:34:56.789Z",
  upvotes: 42,
  downvotes: 3,
  views: 1234,
  answers: 5,
  tags: [
    { _id: "tag1", name: "React" },
    { _id: "tag2", name: "Node" },
    { _id: "tag3", name: "PostgreSQL" },
  ],
  author: {
    _id: "u456",
    name: "Jane Doe",
    image: "/avatars/jane-doe.png",
  },
};
```

#### 3. Component Structure

The main QuestionDetails component implements:

```tsx
const QuestionDetails = async ({ params }: RouteParams) => {
  // destructure the params
  // const { id } = await params;
  return (
    <>
      {/* Question Header Section */}
      <div className="flex-start w-full flex-col">
        <div className="w-full flex flex-col-reverse justify-between">
          {/* Author Information */}
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          {/* Voting Section Placeholder */}
          <div className="flex justify-end">
            <p>Votes</p>
          </div>
        </div>
        {/* Question Title */}
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {sampleQuestion.title}
        </h2>
      </div>

      {/* Metrics Section */}
      <div className="flex flex-wrap gap-4 mt-5 mb-8">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock value"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message value"
          value={answers}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye value"
          value={formatNumber(views)}
          title=""
          textStyles="text-dark200_light700 small-regular"
        />
      </div>

      {/* Content Preview Placeholder */}
      <p>Preview contents</p>

      {/* Tags Section */}
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag: { _id: string; name: string }) => (
          <TagCard
            key={tag._id}
            _id={tag._id as string}
            name={tag.name}
            compact
          />
        ))}
      </div>
    </>
  );
};
```

### Layout Structure

#### 1. Header Section

- **Author Information**: Displays user avatar and name with profile link
- **Voting Section**: Placeholder for future voting functionality
- **Question Title**: Main heading with proper styling

#### 2. Metrics Display

Three key metrics displayed horizontally:

- **Timestamp**: Shows when the question was asked
- **Answer Count**: Number of answers received
- **View Count**: Formatted view count (using `formatViewsNumber` utility)

#### 3. Content Area

- Content preview placeholder (to be implemented with markdown renderer)

#### 4. Tags Section

- Dynamic tag rendering using the `TagCard` component
- Responsive layout with flexbox

### Styling Classes Used

#### Typography Classes

- `h2-semibold text-dark200_light900`: Main heading
- `paragraph-semibold text-dark300_light700`: Author name
- `text-dark200_light700 small-regular`: Metric text

#### Layout Classes

- `flex-start w-full flex-col`: Main container
- `flex flex-col-reverse justify-between`: Header layout
- `flex items-center justify-start gap-1`: Author info alignment
- `flex flex-wrap gap-4 mt-5 mb-8`: Metrics container
- `mt-8 flex flex-wrap gap-2`: Tags container

### Component Dependencies

#### Custom Components Used

1. **UserAvatar**: Displays user profile picture or initials
2. **Metric**: Reusable component for displaying stats with icons
3. **TagCard**: Displays individual tags with styling

#### Utility Functions

1. **getTimeStamp()**: Converts date to human-readable time ago format
2. **formatViewsNumber()**: Formats large numbers with K/M suffixes

### Data Flow

1. Sample data destructured at component level
2. Static data passed to child components
3. Future implementation will fetch real data using the `id` parameter

### Future Enhancements Planned

1. Replace sample data with actual API call using `getQuestion()` action
2. Implement markdown content rendering for question body
3. Add voting functionality
4. Add answer display section
5. Implement real-time updates for metrics

### Technical Notes

- Component is marked as `async` for future data fetching
- TypeScript interfaces ensure type safety
- Responsive design implemented with Tailwind classes
- Clean separation of concerns with modular components

### Performance Considerations

- Static sample data for fast initial rendering
- Efficient component composition
- Proper key props for mapped elements
- Lazy loading ready for future content

## Related Files Modified

### Utility Functions (`lib/utils.ts`)

Added `formatNumber()` function:

```typescript
export const formatNumber = (views: number): string => {
  if (views >= 1000000) {
    return (views / 1000000).toFixed(1) + "M";
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1) + "K";
  } else {
    return views.toString();
  }
};
```

### Component Enhancements

- Enhanced `Metric` component with better prop handling
- Improved `UserAvatar` component with responsive features
- Added proper TypeScript imports across components

## Development Status

- ✅ Basic layout implementation
- ✅ Sample data integration
- ✅ Component composition
- ✅ Responsive design
- ✅ Content rendering with MDX support
- ⏳ Real data integration (planned)
- ⏳ Voting functionality (planned)

## Preview Component Implementation

### File Location

`components/editor/Preview.tsx`

### Code Implementation

```tsx
import { MDXRemote } from "next-mdx-remote/rsc";

export const Preview = ({ content }: { content: string }) => {
  try {
    // Handle undefined or null content
    if (!content) {
      return (
        <section className="prose dark:prose-invert max-w-none">
          <p>No content available</p>
        </section>
      );
    }

    // Clean and format the content more safely
    const formattedContent = content
      .replace(/\\/g, "")
      .replace(/&#x20;/g, " ")
      .trim();

    // Validate that we have actual content to render
    if (!formattedContent) {
      return (
        <section className="prose dark:prose-invert max-w-none">
          <p>Content is empty</p>
        </section>
      );
    }

    return (
      <section className="prose dark:prose-invert max-w-none">
        <MDXRemote
          source={formattedContent}
          options={{
            parseFrontmatter: false,
          }}
        />
      </section>
    );
  } catch (error) {
    console.error("Error rendering MDX content:", error);

    // Fallback to simple markdown-like rendering
    return (
      <section className="prose dark:prose-invert max-w-none">
        <div className="fallback-content">
          <h3 className="text-yellow-600 dark:text-yellow-400 mb-2">
            Content Preview (Fallback Mode)
          </h3>
          <div className="whitespace-pre-wrap text-sm border-l-4 border-gray-300 pl-4 bg-gray-50 dark:bg-gray-800 p-4 rounded">
            {content}
          </div>
        </div>
      </section>
    );
  }
};
```

### Features

- **MDX Support**: Renders markdown with JSX components
- **Error Handling**: Graceful fallback when MDX parsing fails
- **Content Validation**: Checks for empty or null content
- **Typography Styling**: Uses Tailwind's prose classes for beautiful text rendering
- **Dark Mode Support**: Automatic dark mode styling with `dark:prose-invert`

### Dependencies

- `next-mdx-remote`: For server-side MDX rendering
- `@tailwindcss/typography`: For prose styling classes

### Error Fixes Applied

1. **Scope Issue**: Moved content destructuring inside component function
2. **Error Boundaries**: Added try-catch for MDX rendering failures
3. **Content Validation**: Added checks for undefined/empty content
4. **Fallback Rendering**: Alternative display when MDX fails

### Integration

The Preview component is imported and used in the question details page:

```tsx
import { Preview } from "@/components/editor/Preview";

// Inside the component JSX:
<Preview content={content} />;
```
