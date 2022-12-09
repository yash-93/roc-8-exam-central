import { text } from "@keystone-6/core/fields";
import { customAlphabet } from 'nanoid';

// export function slug() {
//   const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
//   const nanoid = customAlphabet(alphabet, 6);

//   return text({
//     defaultValue: ({ inputData }: any) => {
//       let input = inputData?.name || inputData?.title || 'new-item';
//       input = input
//         .trim()
//         .toLowerCase()
//         .replace(/[^\w ]+/g, '')
//         .replace(/ +/g, '-') ?? ''

//       return (
//         input + nanoid()
//       );
//     },
//     ui: { createView: { fieldMode: 'hidden' } },
//   });
// }

export function slug() {
  const alphabet = '0123456789abcdefghijklmnopqrstuvwxyz';
  const nanoid = customAlphabet(alphabet, 6);
  return text({
    hooks: {
      resolveInput: ({ inputData }) => {
        let input = inputData?.name || inputData?.title || 'new-item';
        input = input
          .trim()
          .toLowerCase()
          .replace(/[^\w ]+/g, '')
          .replace(/ +/g, '-') ?? ''
        return (
          input + nanoid()
        );
      }
    },
    ui: { createView: { fieldMode: 'hidden' } }
  })
}