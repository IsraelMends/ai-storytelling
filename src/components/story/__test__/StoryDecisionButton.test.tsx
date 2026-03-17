import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import  StoryDecisionButtons  from "../StoryDecisionButtons";
import type { StoryEdge } from "@/types/story";

describe("StoryDecisionButtons", () => {
  test("chama onSelect com o edge correto", async () => {
    const user = userEvent.setup();
    const onSelect = jest.fn();

    const edges: StoryEdge[] = [
      { id: "E1", label: "Ir para a floresta", from: "START", to: "N2" },
      { id: "E2", label: "Voltar para casa", from: "START", to: "N3" },
    ];

    render(<StoryDecisionButtons edges={edges} onSelect={onSelect} />);

    await user.click(screen.getByText("Ir para a floresta"));
    expect(onSelect).toHaveBeenCalledWith(edges[0]);
  });

  test("exibe mensagem correta quando sem edges", () => {
    render(<StoryDecisionButtons edges={[]} onSelect={jest.fn()} />);
    expect(screen.getByText(/Fim deste ramo/i)).toBeInTheDocument();
  });
});